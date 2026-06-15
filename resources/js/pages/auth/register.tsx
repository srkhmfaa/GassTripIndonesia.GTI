import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GtiAuthLayout from '@/layouts/gti_auth_layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    [key: string]: string | boolean;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GtiAuthLayout>
            <Head title="Daftar - GasssTrip Indonesia" />

            <h1 className="text-lg font-semibold text-gray-900">Buat Akun Baru</h1>
            <p className="mb-6 text-sm text-gray-500">Daftar untuk mulai merencanakan perjalananmu</p>

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid gap-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nama Lengkap
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Nama lengkap"
                        className="rounded-lg border-gray-300 focus-visible:ring-[#0F6E56]"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        tabIndex={2}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        placeholder="nama@email.com"
                        className="rounded-lg border-gray-300 focus-visible:ring-[#0F6E56]"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                            className="rounded-lg border-gray-300 pr-10 focus-visible:ring-[#0F6E56]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                        Konfirmasi Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Ulangi password"
                            className="rounded-lg border-gray-300 pr-10 focus-visible:ring-[#0F6E56]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} />
                </div>

                <Button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-[#0F6E56] text-white hover:bg-[#085041]"
                    tabIndex={5}
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Daftar
                </Button>

                <div className="text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')} className="text-[#0F6E56] hover:text-[#085041]" tabIndex={6}>
                        Masuk
                    </TextLink>
                </div>
            </form>
        </GtiAuthLayout>
    );
}