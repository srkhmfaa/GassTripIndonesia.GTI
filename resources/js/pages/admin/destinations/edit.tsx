import { Head, Link, useForm } from '@inertiajs/react';
import { MapPin, ArrowLeft, Loader2 } from 'lucide-react';

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

export default function EditDestination({ destination }: Props) {
    // Format tanggal jam_operasional ke format input datetime-local jika ada
    const formattedDate = destination.jam_operasional 
        ? new Date(destination.jam_operasional).toISOString().slice(0, 16) 
        : '';

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // Trik Laravel untuk update data + file upload
        name: destination.name,
        category: destination.category,
        city: destination.city,
        description: destination.description ?? '',
        price: Number(destination.price),
        latitude: destination.latitude,
        longitude: destination.longitude,
        jam_operasional: formattedDate,
        hidden_gem: destination.hidden_gem,
        image: null as File | null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Tetap pakai router.post karena ada trik _method di atas
        post(route('admin.destinations.update', destination.destination_id));
    }

    return (
        <>
            <Head title={`Edit Destinasi — ${destination.name}`} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-6">
                    <Link href={route('admin.destinations.index')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4 transition">
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </Link>

                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <div className="flex items-center gap-2 border-b pb-4 mb-6">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-800">Edit Destinasi Wisata</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Destinasi *</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                                    <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="Wisata Alam">Wisata Alam</option>
                                        <option value="Kuliner">Kuliner</option>
                                        <option value="Budaya">Budaya</option>
                                        <option value="Belanja">Belanja</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kota *</label>
                                    <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Tiket Masuk (Rp) *</label>
                                    <input type="number" value={data.price} onChange={e => setData('price', Number(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                                    <input type="number" step="any" value={data.latitude} onChange={e => setData('latitude', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                                    <input type="number" step="any" value={data.longitude} onChange={e => setData('longitude', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
                                    <input type="datetime-local" value={data.jam_operasional} onChange={e => setData('jam_operasional', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                    {errors.jam_operasional && <p className="text-red-500 text-xs mt-1">{errors.jam_operasional}</p>}
                                </div>
                                <div className="pt-5">
                                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                        <input type="checkbox" checked={data.hidden_gem} onChange={e => setData('hidden_gem', e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Tandai sebagai Hidden Gem ✨</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ganti Foto Destinasi</label>
                                {destination.image_url && (
                                    <div className="mb-2">
                                        <p className="text-xs text-gray-400 mb-1">Foto Saat Ini:</p>
                                        <img src={destination.image_url} alt={destination.name} className="w-32 h-20 object-cover rounded border" />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} className="w-full border rounded-lg px-3 py-1.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>

                            <div className="border-t pt-4 flex justify-end gap-2">
                                <Link href={route('admin.destinations.index')} className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50">
                                    Batal
                                </Link>
                                <button type="submit" disabled={processing} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}