import { Head, usePage } from '@inertiajs/react';
import { Mountain, Building2, Waves, Plus } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Beranda', href: '/dashboard' },
];

const popularDestinations = [
    { name: 'Malang', count: 280, icon: Mountain, color: '#A7D7C5' },
    { name: 'Bali', count: 540, icon: Mountain, color: '#5BBF9E' },
    { name: 'Yogyakarta', count: 320, icon: Building2, color: '#F5C16C' },
    { name: 'Lombok', count: 195, icon: Waves, color: '#F0B8AC' },
];

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const userName = auth?.user?.name ?? 'Traveler';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Beranda - GasssTrip Indonesia" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Hero greeting */}
                <div className="rounded-2xl bg-[#0F6E56] px-6 py-6 text-white">
                    <p className="text-sm text-white/70">Halo, {userName}!</p>
                    <h1 className="mt-1 text-xl font-semibold">Mau pergi kemana hari ini?</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <p className="text-3xl font-bold text-gray-900">0</p>
                        <p className="mt-1 text-sm text-gray-500">Itinerary tersimpan</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <p className="text-3xl font-bold text-gray-900">0</p>
                        <p className="mt-1 text-sm text-gray-500">Destinasi dijelajahi</p>
                    </div>
                </div>

                {/* Popular destinations */}
                <h2 className="mb-1 text-base font-semibold text-gray-900">Destinasi populer</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {popularDestinations.map((dest) => {
                        const Icon = dest.icon;
                        return (
                            <div key={dest.name} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                                <div
                                    className="flex h-24 items-center justify-center"
                                    style={{ backgroundColor: dest.color }}
                                >
                                    <Icon className="h-8 w-8 text-white/90" />
                                </div>
                                <div className="p-3">
                                    <p className="font-medium text-gray-900">{dest.name}</p>
                                    <p className="text-sm text-gray-500">{dest.count} destinasi</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                    Buat itinerary baru
                </button>
            </div>
        </AppLayout>
    );
}