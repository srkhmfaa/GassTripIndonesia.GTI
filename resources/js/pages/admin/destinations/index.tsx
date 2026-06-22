import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';

interface Destination {
    destination_id: number;
    name: string;
    category: string;
    city: string;
    price: string;
    hidden_gem: boolean;
    image_url: string | null;
}

interface PaginatedDestinations {
    data: Destination[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    destinations: PaginatedDestinations;
    cities: string[];
    categories: string[];
    filters: { search?: string; city?: string; category?: string };
}

export default function AdminDestinationsIndex({ destinations, cities, categories, filters }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const [search, setSearch] = useState(filters.search ?? '');
    const [city, setCity] = useState(filters.city ?? '');
    const [category, setCategory] = useState(filters.category ?? '');

    function applyFilter() {
        router.get(route('admin.destinations.index'), { search, city, category }, { preserveState: true, replace: true });
    }

    function deleteDestination(dest: Destination) {
        if (!confirm(`Hapus destinasi "${dest.name}"?`)) return;
        router.delete(route('admin.destinations.destroy', dest.destination_id));
    }

    return (
        <>
            <Head title="Kelola Destinasi" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <h1 className="text-xl font-semibold text-gray-800">Kelola Destinasi</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.dashboard')} className="text-sm text-gray-500 hover:text-gray-800">
                            ← Dashboard Admin
                        </Link>
                        <Link
                            href={route('admin.destinations.create')}
                            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                        >
                            <Plus className="w-4 h-4" /> Tambah Destinasi
                        </Link>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 py-8">
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {flash.success}
                        </div>
                    )}

                    {/* Filter */}
                    <div className="bg-white border rounded-xl p-4 mb-6 flex flex-wrap gap-3">
                        <input
                            type="text"
                            placeholder="Cari nama destinasi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                            className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <select value={city} onChange={(e) => setCity(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                            <option value="">Semua Kota</option>
                            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={applyFilter} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                            Cari
                        </button>
                        {(search || city || category) && (
                            <button onClick={() => { setSearch(''); setCity(''); setCategory(''); router.get(route('admin.destinations.index')); }}
                                className="text-sm text-gray-500 hover:text-gray-800 px-2">
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Tabel */}
                    <div className="bg-white border rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Gambar</th>
                                    <th className="px-4 py-3 font-medium">Nama</th>
                                    <th className="px-4 py-3 font-medium">Kategori</th>
                                    <th className="px-4 py-3 font-medium">Kota</th>
                                    <th className="px-4 py-3 font-medium">Harga</th>
                                    <th className="px-4 py-3 font-medium">Hidden Gem</th>
                                    <th className="px-4 py-3 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {destinations.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-gray-400">
                                            Tidak ada destinasi ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    destinations.data.map((dest) => (
                                        <tr key={dest.destination_id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                {dest.image_url
                                                    ? <img src={dest.image_url} alt={dest.name} className="w-14 h-10 object-cover rounded" />
                                                    : <div className="w-14 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">No img</div>
                                                }
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">{dest.name}</td>
                                            <td className="px-4 py-3">
                                                <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">{dest.category}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{dest.city}</td>
                                            <td className="px-4 py-3 text-gray-800">
                                                Rp {Number(dest.price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">
                                                {dest.hidden_gem
                                                    ? <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">✨ Ya</span>
                                                    : <span className="text-gray-400 text-xs">Tidak</span>
                                                }
                                            </td>
                                            <td className="px-4 py-3 flex items-center gap-2">
                                                <Link
                                                    href={route('admin.destinations.edit', dest.destination_id)}
                                                    className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteDestination(dest)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {destinations.last_page > 1 && (
                            <div className="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                                <span>Menampilkan {destinations.from}–{destinations.to} dari {destinations.total} destinasi</span>
                                <div className="flex gap-1">
                                    {destinations.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={`px-3 py-1 rounded text-xs ${link.active ? 'bg-green-600 text-white' : 'border hover:bg-gray-50 disabled:opacity-40'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}