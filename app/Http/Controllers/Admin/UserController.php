<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * List semua pengguna untuk dikelola admin.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Ubah role seorang user.
     */
    public function updateRole(Request $request, User $user)
    {
        abort_if(
            $user->id === $request->user()->id,
            422,
            'Tidak bisa mengubah role milik sendiri.'
        );

        $validated = $request->validate([
            'role' => 'required|string|in:traveler,admin',
        ]);

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'Role pengguna berhasil diperbarui.');
    }

    /**
     * Ubah status akun seorang user.
     */
    public function updateStatus(Request $request, User $user)
    {
        abort_if(
            $user->id === $request->user()->id,
            422,
            'Tidak bisa mengubah status akun milik sendiri.'
        );

        $validated = $request->validate([
            'status_akun' => 'required|string|in:aktif,nonaktif',
        ]);

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'Status pengguna berhasil diperbarui.');
    }

    /**
     * Hapus user.
     */
    public function destroy(Request $request, User $user)
    {
        abort_if(
            $user->id === $request->user()->id,
            422,
            'Tidak bisa menghapus akun milik sendiri.'
        );

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Pengguna berhasil dihapus.');
    }
}