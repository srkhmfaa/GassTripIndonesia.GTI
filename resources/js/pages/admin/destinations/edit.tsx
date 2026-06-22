import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Destination {
    destination_id: number;
    name: string;
    category: string;
    city: string;
    description: string | null;
    price: string;
    latitude: string;
    longitude: string;
    jam_operasional: string | null;
    hidden_gem: boolean;
    image_url: string | null;
}

interface Props {
    destination: Destination;
}

export default function AdminDestinationEdit({ destination }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: destination.name,
        category: destination.category,
        city: destination.city,
        description: destination.description ?? '',
        price: destination.price,
        latitude: destination.latitude,
        longitude: destination.longitude,
        jam_operasional: destination.jam_operasional
            ? destination.jam_operasional.slice(0, 16)
            : '',
        hidden_gem: destination.hidden_gem,
        image: null as File | null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.destinations.update', destination.destination_id), {
            forceFormData: true,
        });
    }

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Data Tempat Wisata', href: '/admin/destinations' },
            { title: 'Edit Destinasi', href: '#' },
        ]}>
            <Head title="Edit Destinasi" />

            <div className="max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Destinasi</h1>
                </div>

                <div className="bg-white border rounded-xl p-6">
                    {/* Preview gambar lama */}
                    {destination.image_url && (
                        <div className="mb-5">
                            <p className="text-sm font-medium text-gray-700 mb-2">Gambar saat ini:</p>
                            <img
                                src={destination.image_url}
                                alt={destination.name}
                                className="w-40 h-28 object-cover rounded-lg border"
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField label="Nama Destinasi" error={errors.name}>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="input"
                            />
                        </FormField>

                        <FormField label="Kategori" error={errors.category}>
                            <select value={data.category} onChange={(e) => setData('category', e.target.value)} className="input">
                                <option value="">-- Pilih Kategori --</option>
                                <option value="Wisata Alam">Wisata Alam</option>
                                <option value="Kuliner">Kuliner</option>
                                <option value="Budaya">Budaya</option>
                                <option value="Belanja">Belanja</option>
                            </select>
                        </FormField>

                        <FormField label="Kota" error={errors.city}>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className="input"
                            />
                        </FormField>

                        <FormField label="Deskripsi" error={errors.description}>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="input min-h-24 resize-y"
                            />
                        </FormField>

                        <FormField label="Harga Tiket (Rp)" error={errors.price}>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="input"
                                min="0"
                            />
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Latitude" error={errors.latitude}>
                                <input
                                    type="number"
                                    step="any"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', e.target.value)}
                                    className="input"
                                />
                            </FormField>
                            <FormField label="Longitude" error={errors.longitude}>
                                <input
                                    type="number"
                                    step="any"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', e.target.value)}
                                    className="input"
                                />
                            </FormField>
                        </div>

                        <FormField label="Jam Operasional" error={errors.jam_operasional}>
                            <input
                                type="datetime-local"
                                value={data.jam_operasional}
                                onChange={(e) => setData('jam_operasional', e.target.value)}
                                className="input"
                            />
                        </FormField>

                        <FormField label="Ganti Gambar (opsional)" error={errors.image}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                className="input file:mr-3 file:px-3 file:py-1 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:text-sm"
                            />
                            <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengganti gambar.</p>
                        </FormField>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="hidden_gem"
                                checked={data.hidden_gem}
                                onChange={(e) => setData('hidden_gem', e.target.checked)}
                                className="w-4 h-4 accent-blue-600"
                            />
                            <label htmlFor="hidden_gem" className="text-sm text-gray-700">
                                Tandai sebagai Hidden Gem ✨
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Link
                                href={route('admin.destinations.index')}
                                className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}