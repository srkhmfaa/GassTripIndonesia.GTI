import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GtiAuthLayout from '@/layouts/gti_auth_layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GtiAuthLayout>
            <Head title="Masuk - GasssTrip Indonesia" />

            <h1 className="text-lg font-semibold text-gray-900">Selamat Datang</h1>
            <p className="mb-6 text-sm text-gray-500">Masuk untuk melanjutkan perjalananmu</p>

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
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
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
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

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            tabIndex={3}
                            className="h-4 w-4 rounded border-gray-300 text-[#0F6E56] focus:ring-[#0F6E56]"
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-600">
                            Ingat saya
                        </Label>
                    </div>
                    {canResetPassword && (
                        <TextLink
                            href={route('password.request')}
                            className="text-sm text-[#0F6E56] hover:text-[#085041]"
                            tabIndex={5}
                        >
                            Lupa password?
                        </TextLink>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full rounded-lg bg-[#0F6E56] text-white hover:bg-[#085041]"
                    tabIndex={4}
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Masuk
                </Button>

                <div className="text-center text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <TextLink href={route('register')} className="text-[#0F6E56] hover:text-[#085041]" tabIndex={5}>
                        Daftar sekarang
                    </TextLink>
                </div>
            </form>

            {status && <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </GtiAuthLayout>
    );
}