import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { Users, MapPin, Map } from 'lucide-react';

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
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Selamat datang, Admin!</h1>
                <p className="text-gray-500 mt-1">Kelola pengguna dan destinasi wisata di sini.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
        </AdminLayout>
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