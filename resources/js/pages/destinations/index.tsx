import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Jelajahi', href: '/destinations' },
];

interface Destination {
    destination_id: number;
    name: string;
    category: string;
    city: string;
    price: string;
    description: string | null;
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

export default function DestinationsIndex({ destinations, cities, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [city, setCity] = useState(filters.city ?? '');
    const [category, setCategory] = useState(filters.category ?? '');

    function applyFilter() {
        router.get(route('destinations.index'), { search, city, category }, { preserveState: true, replace: true });
    }

    function resetFilter() {
        setSearch('');
        setCity('');
        setCategory('');
        router.get(route('destinations.index'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jelajahi Destinasi" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Hero */}
                <div className="rounded-2xl bg-[#0F6E56] px-6 py-6 text-white">
                    <p className="text-sm text-white/70">Temukan tempat wisata terbaik</p>
                    <h1 className="mt-1 text-xl font-semibold">Jelajahi Destinasi Indonesia</h1>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex flex-1 min-w-48 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Cari destinasi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                            className="text-sm flex-1 focus:outline-none"
                        />
                    </div>
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
                    >
                        <option value="">Semua Kota</option>
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                        onClick={applyFilter}
                        className="rounded-xl bg-[#0F6E56] text-white px-4 py-2 text-sm hover:bg-[#0a5c47]"
                    >
                        Cari
                    </button>
                    {(search || city || category) && (
                        <button
                            onClick={resetFilter}
                            className="text-sm text-gray-500 hover:text-gray-800 px-2"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Grid */}
                {destinations.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <MapPin className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm">Tidak ada destinasi ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {destinations.data.map((dest) => (
                            <div
                                key={dest.destination_id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-md transition"
                            >
                                {/* Gambar */}
                                {dest.image_url ? (
                                    <img
                                        src={dest.image_url}
                                        alt={dest.name}
                                        className="w-full h-44 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-300">
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                )}

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{dest.name}</h3>
                                        {dest.hidden_gem && (
                                            <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full shrink-0">
                                                ✨ Hidden Gem
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                                        <MapPin className="w-3 h-3" />
                                        <span>{dest.city}</span>
                                        <span className="mx-1">·</span>
                                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                            {dest.category}
                                        </span>
                                    </div>

                                    {dest.description && (
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                            {dest.description}
                                        </p>
                                    )}

                                    <span className="text-sm font-semibold text-[#0F6E56]">
                                        {Number(dest.price) === 0
                                            ? 'Gratis'
                                            : `Rp ${Number(dest.price).toLocaleString('id-ID')}`
                                        }
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {destinations.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                        <span>Menampilkan {destinations.from}–{destinations.to} dari {destinations.total} destinasi</span>
                        <div className="flex gap-1">
                            {destinations.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-3 py-1 rounded-lg text-xs ${
                                        link.active
                                            ? 'bg-[#0F6E56] text-white'
                                            : 'border hover:bg-gray-50 disabled:opacity-40'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}