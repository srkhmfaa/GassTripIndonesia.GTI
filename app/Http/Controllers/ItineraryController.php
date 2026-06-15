<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Itinerary;
use App\Models\ItineraryDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItineraryController extends Controller
{
    /**
     * Daftar itinerary milik user + form buat baru.
     */
    public function index(Request $request)
    {
        $itineraries = Itinerary::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('itineraries/index', [
            'itineraries' => $itineraries,
        ]);
    }

    /**
     * Generate itinerary otomatis berdasarkan input form.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_city'     => 'required|string|max:225',
            'duration_days'   => 'required|integer|min:1|max:30',
            'max_budget'      => 'required|numeric|min:0',
            'budget_category' => 'required|string|in:hemat,menengah,mewah',
            'categories'      => 'array',
        ]);

        // 1. Simpan itinerary header
        $itinerary = Itinerary::create([
            'user_id'         => $request->user()->id,
            'target_city'     => $validated['target_city'],
            'start_date'      => now()->addDay(),
            'duration_days'   => $validated['duration_days'],
            'budget_category' => $validated['budget_category'],
            'max_budget'      => $validated['max_budget'],
            'total_estimated_cost' => 0,
        ]);

        // 2. Ambil destinasi sesuai kota (+ filter kategori jika ada)
        $query = Destination::where('city', $validated['target_city']);

        if (!empty($validated['categories'])) {
            $query->whereIn('category', $validated['categories']);
        }

        $destinations = $query->orderByDesc('hidden_gem')->get();

        // 3. Alokasi sederhana: distribusikan destinasi ke setiap hari,
        //    hentikan kalau total biaya sudah mendekati max_budget
        $totalCost = 0;
        $visitOrder = 1;
        $currentDay = 1;
        $perDayLimit = 4; // maksimal 4 aktivitas per hari

        foreach ($destinations as $destination) {
            if ($currentDay > $validated['duration_days']) {
                break;
            }

            if (($totalCost + $destination->price) > $validated['max_budget']) {
                continue;
            }

            ItineraryDetail::create([
                'itinerary_id'    => $itinerary->itinerary_id,
                'destination_id'  => $destination->destination_id,
                'visit_day'       => now()->addDays($currentDay - 1)->format('Y-m-d'),
                'visit_order'     => $visitOrder,
                'estimated_time'  => null,
            ]);

            $totalCost += $destination->price;
            $visitOrder++;

            if ($visitOrder > $perDayLimit) {
                $visitOrder = 1;
                $currentDay++;
            }
        }

        // 4. Update total estimasi biaya
        $itinerary->update(['total_estimated_cost' => $totalCost]);

        return redirect()->route('itineraries.show', $itinerary->itinerary_id);
    }

    /**
     * Tampilkan hasil itinerary lengkap dengan detail per hari.
     */
    public function show(Request $request, Itinerary $itinerary)
    {
        abort_if($itinerary->user_id !== $request->user()->id, 403);

        $details = ItineraryDetail::where('itinerary_id', $itinerary->itinerary_id)
            ->with('destination')
            ->orderBy('visit_day')
            ->orderBy('visit_order')
            ->get()
            ->groupBy('visit_day');

        return Inertia::render('itineraries/show', [
            'itinerary' => $itinerary,
            'detailsByDay' => $details,
        ]);
    }
}