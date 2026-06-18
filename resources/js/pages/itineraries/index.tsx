import { Head, useForm, Link, router } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { LoaderCircle, Plus, Trash2, Pencil } from 'lucide-react';

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
    start_date: string;
    duration_days: number;
    max_budget: string;
    total_estimated_cost: string;
    budget_category: string;
    created_at: string;
}

interface ItineraryForm {
    target_city: string;
    start_date: string;
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

interface IndexProps {
    itineraries: ItineraryItem[];
    editingItinerary: ItineraryItem | null;
}

export default function ItineraryIndex({ itineraries, editingItinerary }: IndexProps) {
    const isEditing = !!editingItinerary;

    const { data, setData, post, put, processing, errors } = useForm<ItineraryForm>({
        target_city: editingItinerary?.target_city ?? 'Yogyakarta',
        start_date: editingItinerary?.start_date?.split('T')[0] ?? '',
        duration_days: editingItinerary?.duration_days ?? 3,
        max_budget: editingItinerary ? Number(editingItinerary.max_budget) : 2500000,
        budget_category: editingItinerary?.budget_category ?? 'menengah',
        categories: ['Wisata Alam', 'Kuliner'],
    });

    useEffect(() => {
        if (editingItinerary) {
            setData({
                target_city: editingItinerary.target_city,
                start_date: editingItinerary.start_date.split('T')[0],
                duration_days: editingItinerary.duration_days,
                max_budget: Number(editingItinerary.max_budget),
                budget_category: editingItinerary.budget_category,
                categories: ['Wisata Alam', 'Kuliner'],
            });
        }
    }, [editingItinerary]);

    const toggleCategory = (value: string) => {
        if (data.categories.includes(value)) {
            setData('categories', data.categories.filter((c) => c !== value));
        } else {
            setData('categories', [...data.categories, value]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing && editingItinerary) {
            put(route('itineraries.update', editingItinerary.itinerary_id));
        } else {
            post(route('itineraries.store'));
        }
    };

    const cancelEdit = () => {
        router.get(route('itineraries.index'));
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
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="bg-[#0F6E56] px-6 py-4">
                        <h1 className="text-base font-semibold text-white">
                            {isEditing ? 'Edit itinerary' : 'Rencanakan perjalananmu'}
                        </h1>
                        <p className="text-sm text-white/70">
                            {isEditing ? 'Ubah parameter, kami susun ulang jadwalmu' : 'Masukkan detail, kami urus sisanya'}
                        </p>
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
                            <Label htmlFor="start_date">Tanggal mulai</Label>
                            <Input
                                id="start_date"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="focus-visible:ring-[#0F6E56]"
                            />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="max_budget">Anggaran maksimal (Rp)</Label>
                            <Input
                                id="max_budget"
                                type="number"
                                min={0}
                                step={10000}
                                value={data.max_budget}
                                onChange={(e) => setData('max_budget', Number(e.target.value))}
                                placeholder="Contoh: 2500000"
                                className="focus-visible:ring-[#0F6E56]"
                            />
                            {data.max_budget > 0 && (
                                <p className="text-sm font-medium text-[#0F6E56]">
                                    Rp {data.max_budget.toLocaleString('id-ID')}
                                </p>
                            )}
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

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-lg bg-[#0F6E56] text-white hover:bg-[#085041]"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {isEditing ? 'Simpan & generate ulang' : 'Generate itinerary otomatis'}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="outline" onClick={cancelEdit} className="rounded-lg">
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

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
                                            Mulai{' '}
                                            {new Date(item.start_date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}{' '}
                                            · Est. Rp {Number(item.total_estimated_cost).toLocaleString('id-ID')}
                                        </p>
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={route('itineraries.edit', item.itinerary_id)}
                                            className="text-gray-400 hover:text-[#0F6E56]"
                                            title="Edit itinerary"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <Link href={route('itineraries.show', item.itinerary_id)} className="text-sm text-[#0F6E56]">
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