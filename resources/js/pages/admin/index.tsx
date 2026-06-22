import { Head, Link } from '@inertiajs/react';
import { Users, MapPin, Map, LayoutDashboard } from 'lucide-react';

interface Stats {
    user_count: number;
    destination_count: number;
    itinerary_count: number;
}

interface Props {
    stats: Stats;
}

export default function AdminDashboard({ stats }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-800">Admin Panel — GassTrip Indonesia</h1>
                    </div>
                    <Link href={route('dashboard')} className="text-sm text-gray-500 hover:text-gray-800">
                        ← Kembali ke Dashboard User
                    </Link>
                </div>

                <div className="max-w-6xl mx-auto px-6 py-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat datang, Admin!</h2>
                    <p className="text-gray-500 mb-8">Kelola pengguna dan destinasi wisata di sini.</p>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        <StatCard
                            icon={<Users className="w-6 h-6 text-blue-600" />}
                            label="Total Pengguna"
                            value={stats.user_count}
                            bg="bg-blue-50"
                        />
                        <StatCard
                            icon={<MapPin className="w-6 h-6 text-green-600" />}
                            label="Total Destinasi"
                            value={stats.destination_count}
                            bg="bg-green-50"
                        />
                        <StatCard
                            icon={<Map className="w-6 h-6 text-purple-600" />}
                            label="Total Itinerary"
                            value={stats.itinerary_count}
                            bg="bg-purple-50"
                        />
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href={route('admin.users.index')}
                            className="block bg-white border rounded-xl p-6 hover:shadow-md transition"
                        >
                            <Users className="w-8 h-8 text-blue-500 mb-3" />
                            <h3 className="font-semibold text-gray-800 text-lg">Kelola Pengguna</h3>
                            <p className="text-sm text-gray-500 mt-1">Ubah role dan status akun pengguna.</p>
                        </Link>
                        <Link
                            href={route('admin.destinations.index')}
                            className="block bg-white border rounded-xl p-6 hover:shadow-md transition"
                        >
                            <MapPin className="w-8 h-8 text-green-500 mb-3" />
                            <h3 className="font-semibold text-gray-800 text-lg">Kelola Destinasi</h3>
                            <p className="text-sm text-gray-500 mt-1">Tambah, edit, atau hapus tempat wisata.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: number; bg: string }) {
    return (
        <div className={`rounded-xl p-6 ${bg} flex items-center gap-4`}>
            <div className="bg-white rounded-lg p-3 shadow-sm">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}