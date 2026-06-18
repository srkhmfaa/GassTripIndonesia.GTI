import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Destination {
    destination_id: number;
    name: string;
    category: string;
    city: string;
    price: string;
    hidden_gem: boolean;
}

interface DetailItem {
    detail_id: number;
    visit_day: string;
    visit_order: number;
    estimated_time: string | null;
    destination: Destination;
}

interface ItineraryData {
    itinerary_id: number;
    target_city: string;
    duration_days: number;
    start_date: string;
    max_budget: string;
    total_estimated_cost: string;
    budget_category: string;
}

interface ShowProps {
    itinerary: ItineraryData;
    detailsByDay: Record<string, DetailItem[]>;
}

export default function ItineraryShow({ itinerary, detailsByDay }: ShowProps) {
    const days = Object.keys(detailsByDay).sort();
    const [activeDay, setActiveDay] = useState(days[0] ?? '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Itinerary', href: '/itineraries' },
        { title: `${itinerary.target_city} - ${itinerary.duration_days} hari`, href: '#' },
    ];

    const formatRupiah = (value: string | number) =>
        `Rp ${Number(value).toLocaleString('id-ID')}`;

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const handleDelete = () => {
        if (confirm('Hapus itinerary ini?')) {
            router.delete(route('itineraries.destroy', itinerary.itinerary_id));
        }
    };

    // Hitung ringkasan biaya per kategori
    const allDetails = days.flatMap((d) => detailsByDay[d]);
    const totalsByCategory: Record<string, number> = {};
    allDetails.forEach((item) => {
        const cat = item.destination.category;
        totalsByCategory[cat] = (totalsByCategory[cat] || 0) + Number(item.destination.price);
    });

    const dotColor = (category: string) => {
        if (category === 'Kuliner') return '#BA7517';
        if (category.toLowerCase().includes('hotel') || category.toLowerCase().includes('penginapan')) return '#534AB7';
        return '#0F6E56';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Itinerary ${itinerary.target_city} - GasssTrip Indonesia`} />

            <div className="flex items-center justify-between">
                <Link
                    href={route('itineraries.index')}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0F6E56]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Itinerary
                </Link>
                <div className="flex items-center gap-3">
                    <Link
                        href={route('itineraries.edit', itinerary.itinerary_id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0F6E56]"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                    </button>
                </div>

                {/* Hero */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="bg-[#0F6E56] px-6 py-4">
                        <h1 className="text-base font-semibold text-white">
                            Itinerary {itinerary.target_city} · {itinerary.duration_days} hari
                        </h1>
                        <p className="text-sm text-white/70">
                            Est. {formatRupiah(itinerary.total_estimated_cost)} dari {formatRupiah(itinerary.max_budget)} budget
                        </p>
                    </div>

                    <div className="p-4">
                        {/* Day tabs */}
                        {days.length > 0 ? (
                            <>
                                <div className="mb-3 flex gap-1 border-b border-gray-200">
                                    {days.map((day, idx) => (
                                        <button
                                            key={day}
                                            onClick={() => setActiveDay(day)}
                                            className={`px-4 py-2 text-sm font-medium transition ${
                                                activeDay === day
                                                    ? 'border-b-2 border-[#0F6E56] text-[#0F6E56]'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            Hari {idx + 1}
                                        </button>
                                    ))}
                                </div>

                                {/* Active day content */}
                                {activeDay && (
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-medium text-[#085041]">
                                                {formatDate(activeDay)}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                Est. {formatRupiah(
                                                    detailsByDay[activeDay].reduce(
                                                        (sum, item) => sum + Number(item.destination.price),
                                                        0
                                                    )
                                                )}
                                            </span>
                                        </div>

                                        <div className="divide-y divide-gray-100">
                                            {detailsByDay[activeDay].map((item) => (
                                                <div key={item.detail_id} className="flex items-start gap-3 py-2.5">
                                                    <span className="min-w-[40px] pt-0.5 text-xs text-gray-400">
                                                        {item.estimated_time
                                                            ? item.estimated_time.slice(0, 5)
                                                            : '--:--'}
                                                    </span>
                                                    <span
                                                        className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                                                        style={{ backgroundColor: dotColor(item.destination.category) }}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {item.destination.name}
                                                            {item.destination.hidden_gem && (
                                                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                                                                    Hidden gem
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.destination.category} · {item.destination.city}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatRupiah(item.destination.price)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                                Belum ada destinasi yang cocok untuk itinerary ini.
                                <br />
                                Pastikan data destinasi untuk kota{' '}
                                <span className="font-medium">{itinerary.target_city}</span> sudah tersedia.
                            </div>
                        )}

                        {/* Ringkasan biaya */}
                        {Object.keys(totalsByCategory).length > 0 && (
                            <div className="mt-4 rounded-xl bg-gray-50 p-4">
                                {Object.entries(totalsByCategory).map(([cat, total]) => (
                                    <div key={cat} className="flex justify-between py-1 text-sm text-gray-600">
                                        <span>{cat}</span>
                                        <span>{formatRupiah(total)}</span>
                                    </div>
                                ))}
                                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold text-gray-900">
                                    <span>Total estimasi</span>
                                    <span>{formatRupiah(itinerary.total_estimated_cost)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}