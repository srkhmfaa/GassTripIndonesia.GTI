<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DestinationController extends Controller
{
    /**
     * Halaman Jelajahi: tampilkan destinasi wisata dengan search & filter.
     */
    public function index(Request $request)
    {
        $query = Destination::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $destinations = $query
            ->orderByDesc('hidden_gem')
            ->orderBy('name')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('destinations/index', [
            'destinations' => $destinations,
            'cities' => Destination::query()->distinct()->orderBy('city')->pluck('city'),
            'categories' => Destination::query()->distinct()->orderBy('category')->pluck('category'),
            'filters' => $request->only(['search', 'city', 'category']),
        ]);
    }
}