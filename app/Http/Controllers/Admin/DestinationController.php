<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DestinationController extends Controller
{
    /**
     * List semua destinasi untuk dikelola admin.
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
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/destinations/index', [
            'destinations' => $destinations,
            'cities' => Destination::query()->distinct()->orderBy('city')->pluck('city'),
            'categories' => Destination::query()->distinct()->orderBy('category')->pluck('category'),
            'filters' => $request->only(['search', 'city', 'category']),
        ]);
    }

    /**
     * Form tambah destinasi baru.
     */
    public function create()
    {
        return Inertia::render('admin/destinations/create');
    }

    /**
     * Simpan destinasi baru.
     */
    public function store(Request $request)
    {
        $validated = $this->validateData($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('destinations', 'public');
        }

        Destination::create($validated);

        return redirect()->route('admin.destinations.index')->with('success', 'Destinasi berhasil ditambahkan.');
    }

    /**
     * Form edit destinasi.
     */
    public function edit(Destination $destination)
    {
        return Inertia::render('admin/destinations/edit', [
            'destination' => $destination,
        ]);
    }

    /**
     * Update destinasi yang sudah ada.
     */
    public function update(Request $request, Destination $destination)
    {
        $validated = $this->validateData($request);

        if ($request->hasFile('image')) {
            if ($destination->image) {
                Storage::disk('public')->delete($destination->image);
            }
            $validated['image'] = $request->file('image')->store('destinations', 'public');
        }

        $destination->update($validated);

        return redirect()->route('admin.destinations.index')->with('success', 'Destinasi berhasil diperbarui.');
    }

    /**
     * Hapus destinasi.
     */
    public function destroy(Destination $destination)
    {
        if ($destination->image) {
            Storage::disk('public')->delete($destination->image);
        }

        $destination->delete();

        return redirect()->route('admin.destinations.index')->with('success', 'Destinasi berhasil dihapus.');
    }

    /**
     * Validasi data form destinasi (dipakai store & update).
     */
    private function validateData(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:225',
            'category' => 'required|string|in:Wisata Alam,Kuliner,Budaya,Belanja',
            'city' => 'required|string|max:225',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'jam_operasional' => 'nullable|date',
            'hidden_gem' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);
    }
}