<?php

use App\Http\Controllers\Admin\DestinationController as AdminDestinationController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController; 
use App\Http\Controllers\Auth\RegisteredUserController; 
use App\Http\Controllers\ItineraryController;
use App\Models\Destination;
use App\Models\Itinerary;
use App\Models\ItineraryDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// =====================
// Routes Autentikasi
// =====================
Route::middleware('web')->group(function () {
    Route::middleware('guest')->group(function () {
        // Login
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);

        // Register (Wajib ada karena dicek oleh component Login React)
        Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
        Route::post('register', [RegisteredUserController::class, 'store']);
    });

    Route::middleware('auth')->group(function () {
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    });
});


// =====================
// Route Halaman Utama
// =====================
Route::get('/', function () {
    return redirect()->route('login');
})->name('home');


// =====================
// Routes USER (Traveler)
// =====================
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $userId = $request->user()->id;

        $itineraryCount = Itinerary::where('user_id', $userId)->count();
        $itineraryIds = Itinerary::where('user_id', $userId)->pluck('itinerary_id');
        $destinationCount = ItineraryDetail::whereIn('itinerary_id', $itineraryIds)
            ->distinct('destination_id')
            ->count('destination_id');

        return Inertia::render('dashboard', [
            'stats' => [
                'itinerary_count' => $itineraryCount,
                'destination_count' => $destinationCount,
            ],
        ]);
    })->name('dashboard');

    Route::get('/itineraries', [ItineraryController::class, 'index'])->name('itineraries.index');
    Route::get('/itineraries/{itinerary}/edit', [ItineraryController::class, 'edit'])->name('itineraries.edit');
    Route::post('/itineraries', [ItineraryController::class, 'store'])->name('itineraries.store');
    Route::put('/itineraries/{itinerary}', [ItineraryController::class, 'update'])->name('itineraries.update');
    Route::get('/itineraries/{itinerary}', [ItineraryController::class, 'show'])->name('itineraries.show');
    Route::delete('/itineraries/{itinerary}', [ItineraryController::class, 'destroy'])->name('itineraries.destroy');
});


// =====================
// Routes ADMIN
// =====================
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard Admin
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'user_count'        => User::where('role', 'traveler')->count(),
                'destination_count' => Destination::count(),
                'itinerary_count'   => Itinerary::count(),
            ],
        ]);
    })->name('dashboard');

    // Kelola User
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.updateRole');
    Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus'])->name('users.updateStatus');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    // Kelola Destinasi
    Route::resource('destinations', AdminDestinationController::class);
});

// Jika butuh sisanya bawaan breeze, panggil filenya di sini
require __DIR__.'/settings.php';