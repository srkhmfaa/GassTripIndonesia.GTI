<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Itinerary;
use App\Models\ItineraryDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Inertia::render('admin/dashboard', [
                'stats' => [
                    'user_count' => User::count(),
                    'destination_count' => Destination::count(),
                    'itinerary_count' => Itinerary::count(),
                ],
            ]);
        }

        $itineraryCount = Itinerary::where('user_id', $user->id)->count();

        $itineraryIds = Itinerary::where('user_id', $user->id)->pluck('itinerary_id');

        $destinationCount = ItineraryDetail::whereIn('itinerary_id', $itineraryIds)
            ->distinct('destination_id')
            ->count('destination_id');

        return Inertia::render('dashboard', [
            'stats' => [
                'itinerary_count' => $itineraryCount,
                'destination_count' => $destinationCount,
            ],
        ]);
    }
}