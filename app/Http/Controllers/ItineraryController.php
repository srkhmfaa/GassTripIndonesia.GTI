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
     * Halaman utama: form buat itinerary (mode create) + list tersimpan.
     */
    public function index(Request $request)
    {
        $itineraries = Itinerary::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('itineraries/index', [
            'itineraries' => $itineraries,
            'editingItinerary' => null,
        ]);
    }

    /**
     * Halaman yang sama, tapi form pre-filled untuk edit (mode edit).
     */
    public function edit(Request $request, Itinerary $itinerary)
    {
        abort_if($itinerary->user_id !== $request->user()->id, 403);

        $itineraries = Itinerary::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('itineraries/index', [
            'itineraries' => $itineraries,
            'editingItinerary' => $itinerary,
        ]);
    }

    /**
     * Generate itinerary baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_city'     => 'required|string|max:225',
            'start_date'      => 'required|date|after_or_equal:today',
            'duration_days'   => 'required|integer|min:1|max:30',
            'max_budget'      => 'required|numeric|min:0',
            'budget_category' => 'required|string|in:hemat,menengah,mewah',
            'categories'      => 'array',
        ]);

        $itinerary = Itinerary::create([
            'user_id'         => $request->user()->id,
            'target_city'     => $validated['target_city'],
            'start_date'      => $validated['start_date'],
            'duration_days'   => $validated['duration_days'],
            'budget_category' => $validated['budget_category'],
            'max_budget'      => $validated['max_budget'],
            'total_estimated_cost' => 0,
        ]);

        $this->generateDetails($itinerary, $validated);

        return redirect()->route('itineraries.show', $itinerary->itinerary_id);
    }

    /**
     * Update itinerary: regenerate details berdasarkan parameter baru.
     */
    public function update(Request $request, Itinerary $itinerary)
    {
        abort_if($itinerary->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'target_city'     => 'required|string|max:225',
            'start_date'      => 'required|date',
            'duration_days'   => 'required|integer|min:1|max:30',
            'max_budget'      => 'required|numeric|min:0',
            'budget_category' => 'required|string|in:hemat,menengah,mewah',
            'categories'      => 'array',
        ]);

        $itinerary->update([
            'target_city'     => $validated['target_city'],
            'start_date'      => $validated['start_date'],
            'duration_days'   => $validated['duration_days'],
            'budget_category' => $validated['budget_category'],
            'max_budget'      => $validated['max_budget'],
            'total_estimated_cost' => 0,
        ]);

        ItineraryDetail::where('itinerary_id', $itinerary->itinerary_id)->delete();

        $this->generateDetails($itinerary, $validated);

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

    /**
     * Hapus itinerary milik user.
     */
    public function destroy(Request $request, Itinerary $itinerary)
    {
        abort_if($itinerary->user_id !== $request->user()->id, 403);

        ItineraryDetail::where('itinerary_id', $itinerary->itinerary_id)->delete();

        $itinerary->delete();

        return redirect()->route('itineraries.index');
    }

    /**
     * Logic generate itinerary_details (dipakai oleh store & update).
     */
    private function generateDetails(Itinerary $itinerary, array $validated): void
    {
        $query = Destination::where('city', $validated['target_city']);

        if (!empty($validated['categories'])) {
            $query->whereIn('category', $validated['categories']);
        }

        $destinations = $query->orderByDesc('hidden_gem')->get();

        $totalCost = 0;
        $visitOrder = 1;
        $currentDay = 1;
        $perDayLimit = 4;

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
                'visit_day'       => \Carbon\Carbon::parse($validated['start_date'])
                    ->addDays($currentDay - 1)
                    ->format('Y-m-d'),
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

        $itinerary->update(['total_estimated_cost' => $totalCost]);
    }
}