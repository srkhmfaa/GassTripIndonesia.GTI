import AdminLayout from '@/layouts/admin-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status_akun: string;
    created_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    users: PaginatedUsers;
    filters: { search?: string; role?: string };
}

export default function AdminUsersIndex({ users, filters }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');

    function applyFilter() {
        router.get(route('admin.users.index'), { search, role }, { preserveState: true, replace: true });
    }

    function updateRole(user: User, newRole: string) {
        router.patch(route('admin.users.updateRole', user.id), { role: newRole }, { preserveScroll: true });
    }

    function updateStatus(user: User, newStatus: string) {
        router.patch(route('admin.users.updateStatus', user.id), { status_akun: newStatus }, { preserveScroll: true });
    }

    function deleteUser(user: User) {
        if (!confirm(`Hapus pengguna "${user.name}"? Aksi ini tidak bisa dibatalkan.`)) return;
        router.delete(route('admin.users.destroy', user.id));
    }

    return (
        <AdminLayout breadcrumbs={[{ title: 'Data Pengguna', href: '/admin/users' }]}>
            <Head title="Kelola Pengguna" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Data Pengguna</h1>
            </div>

            {flash?.success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {flash.success}
                </div>
            )}

            {/* Filter */}
            <div className="bg-white border rounded-xl p-4 mb-6 flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                    className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Semua Role</option>
                    <option value="traveler">Traveler</option>
                    <option value="admin">Admin</option>
                </select>
                <button
                    onClick={applyFilter}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                    Cari
                </button>
                {(search || role) && (
                    <button
                        onClick={() => { setSearch(''); setRole(''); router.get(route('admin.users.index')); }}
                        className="text-sm text-gray-500 hover:text-gray-800 px-2"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Tabel */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-left">
                        <tr>
                            <th className="px-4 py-3 font-medium">Nama</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-400">
                                    Tidak ada pengguna ditemukan.
                                </td>
                            </tr>
                        ) : (
                            users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateRole(user, e.target.value)}
                                            className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="traveler">Traveler</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={user.status_akun}
                                            onChange={(e) => updateStatus(user, e.target.value)}
                                            className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="aktif">Aktif</option>
                                            <option value="nonaktif">Nonaktif</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => deleteUser(user)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                            title="Hapus pengguna"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                        <span>Menampilkan {users.from}–{users.to} dari {users.total} pengguna</span>
                        <div className="flex gap-1">
                            {users.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-3 py-1 rounded text-xs ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'border hover:bg-gray-50 disabled:opacity-40'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}