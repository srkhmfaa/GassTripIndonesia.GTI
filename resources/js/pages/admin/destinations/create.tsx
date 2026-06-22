import { Head, Link, useForm } from '@inertiajs/react';
import { MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import React from 'react';

// Interface diperbaiki dengan menambahkan index signature di baris terakhirnya
interface DestinationForm {
    name: string;
    category: string;
    city: string;
    description: string;
    price: string | number;
    latitude: string | number;
    longitude: string | number;
    jam_operasional: string;
    hidden_gem: boolean;
    image: File | null;
    [key: string]: any; // <--- Ini kunci untuk menghilangkan error FormDataType!
}

export default function CreateDestination() {
    const { data, setData, post, processing, errors } = useForm<DestinationForm>({
        name: '',
        category: 'Wisata Alam',
        city: '',
        description: '',
        price: '',
        latitude: '',
        longitude: '',
        jam_operasional: '',
        hidden_gem: false,
        image: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // @ts-ignore
        post(route('admin.destinations.store'));
    }

    return (
        <>
            <Head title="Tambah Destinasi Baru" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-6">
                    {/* @ts-ignore */}
                    <Link href={route('admin.destinations.index')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4 transition">
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Destinasi
                    </Link>

                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <div className="flex items-center gap-2 border-b pb-4 mb-6">
                            <MapPin className="w-5 h-5 text-green-600" />
                            <h1 className="text-xl font-bold text-gray-800">Tambah Destinasi Baru</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nama & Kategori */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Destinasi *</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                                    <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                                        <option value="Wisata Alam">Wisata Alam</option>
                                        <option value="Kuliner">Kuliner</option>
                                        <option value="Budaya">Budaya</option>
                                        <option value="Belanja">Belanja</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>
                            </div>

                            {/* Kota & Harga */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kota *</label>
                                    <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Tiket Masuk (Rp) *</label>
                                    <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            {/* Koordinat */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                                    <input type="number" step="any" value={data.latitude} onChange={e => setData('latitude', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                                    {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                                    <input type="number" step="any" value={data.longitude} onChange={e => setData('longitude', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                                    {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                                </div>
                            </div>

                            {/* Jam & Hidden Gem */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
                                    <input type="datetime-local" value={data.jam_operasional} onChange={e => setData('jam_operasional', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                                    {errors.jam_operasional && <p className="text-red-500 text-xs mt-1">{errors.jam_operasional}</p>}
                                </div>
                                <div className="pt-5">
                                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                        <input type="checkbox" checked={data.hidden_gem} onChange={e => setData('hidden_gem', e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Hidden Gem ✨</span>
                                    </label>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            {/* Gambar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Destinasi</label>
                                <input type="file" accept="image/*" onChange={e => setData('image', e.target.files ? e.target.files[0] : null)} className="w-full border rounded-lg px-3 py-1.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>

                            <div className="border-t pt-4 flex justify-end gap-2">
                                <button type="submit" disabled={processing} className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Destinasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}