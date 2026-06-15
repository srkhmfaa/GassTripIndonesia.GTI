import { Head, useForm, Link, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Itinerary', href: '/itineraries' },
];

interface ItineraryItem {
    itinerary_id: number;
    target_city: string;
    duration_days: number;
    start_date: string;
    max_budget: string;
    total_estimated_cost: string;
    created_at: string;
}

interface ItineraryForm {
    target_city: string;
    duration_days: number;
    max_budget: number;
    budget_category: string;
    categories: string[];
    [key: string]: string | number | string[];
}

const categoryOptions = [
    { label: 'Alam', value: 'Wisata Alam' },
    { label: 'Kuliner', value: 'Kuliner' },
    { label: 'Budaya', value: 'Budaya' },
    { label: 'Belanja', value: 'Belanja' },
];

export default function ItineraryIndex({ itineraries }: { itineraries: ItineraryItem[] }) {
    const { data, setData, post, processing, errors } = useForm<ItineraryForm>({
        target_city: 'Yogyakarta',
        duration_days: 3,
        max_budget: 2500000,
        budget_category: 'menengah',
        categories: ['Wisata Alam', 'Kuliner'],
    });

    const toggleCategory = (value: string) => {
        if (data.categories.includes(value)) {
            setData('categories', data.categories.filter((c) => c !== value));
        } else {
            setData('categories', [...data.categories, value]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('itineraries.store'));
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus itinerary ini?')) {
            router.delete(route('itineraries.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Itinerary - GasssTrip Indonesia" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Form buat itinerary */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="bg-[#0F6E56] px-6 py-4">
                        <h1 className="text-base font-semibold text-white">Rencanakan perjalananmu</h1>
                        <p className="text-sm text-white/70">Masukkan detail, kami urus sisanya</p>
                    </div>

                    <form onSubmit={submit} className="grid gap-4 p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="target_city">Kota tujuan</Label>
                                <select
                                    id="target_city"
                                    value={data.target_city}
                                    onChange={(e) => setData('target_city', e.target.value)}
                                    className="h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
                                >
                                    <option value="Yogyakarta">Yogyakarta</option>
                                    <option value="Bali">Bali</option>
                                    <option value="Lombok">Lombok</option>
                                    <option value="Malang">Malang</option>
                                </select>
                                <InputError message={errors.target_city} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="duration_days">Durasi (hari)</Label>
                                <Input
                                    id="duration_days"
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={data.duration_days}
                                    onChange={(e) => setData('duration_days', Number(e.target.value))}
                                    className="focus-visible:ring-[#0F6E56]"
                                />
                                <InputError message={errors.duration_days} />
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="max_budget">Anggaran maksimal (Rp)</Label>
                            <input
                                id="max_budget"
                                type="range"
                                min={500000}
                                max={10000000}
                                step={100000}
                                value={data.max_budget}
                                onChange={(e) => setData('max_budget', Number(e.target.value))}
                                className="w-full accent-[#0F6E56]"
                            />
                            <p className="text-sm font-medium text-[#0F6E56]">
                                Rp {data.max_budget.toLocaleString('id-ID')}
                            </p>
                            <InputError message={errors.max_budget} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label>Kategori wisata</Label>
                            <div className="flex flex-wrap gap-2">
                                {categoryOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => toggleCategory(opt.value)}
                                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                            data.categories.includes(opt.value)
                                                ? 'border-[#0F6E56] bg-[#E1F5EE] text-[#085041]'
                                                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label>Kategori budget</Label>
                            <div className="flex gap-2">
                                {['hemat', 'menengah', 'mewah'].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setData('budget_category', cat)}
                                        className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                                            data.budget_category === cat
                                                ? 'border-[#0F6E56] bg-[#E1F5EE] text-[#085041]'
                                                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.budget_category} />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full rounded-lg bg-[#0F6E56] text-white hover:bg-[#085041]"
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Generate itinerary otomatis
                        </Button>
                    </form>
                </div>

                {/* List itinerary tersimpan */}
                <div>
                    <h2 className="mb-3 text-base font-semibold text-gray-900">Itinerary tersimpan</h2>

                    {itineraries.length === 0 ? (
                        <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-500">
                            <Plus className="mr-2 h-4 w-4" />
                            Belum ada itinerary. Buat yang pertama di atas!
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {itineraries.map((item) => (
                                <div
                                    key={item.itinerary_id}
                                    className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
                                >
                                    <Link href={route('itineraries.show', item.itinerary_id)} className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {item.target_city} · {item.duration_days} hari
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Est. Rp {Number(item.total_estimated_cost).toLocaleString('id-ID')} dari Rp{' '}
                                            {Number(item.max_budget).toLocaleString('id-ID')}
                                        </p>
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={route('itineraries.show', item.itinerary_id)}
                                            className="text-sm text-[#0F6E56]"
                                        >
                                            Lihat &rarr;
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.itinerary_id)}
                                            className="text-gray-400 hover:text-red-500"
                                            title="Hapus itinerary"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}