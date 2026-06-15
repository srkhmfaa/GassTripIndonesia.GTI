import { PropsWithChildren } from 'react';

export default function GtiAuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-[#F3F4F4] p-6">
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-[#E5E7EB] px-6 py-4">
                    <span className="text-lg font-bold text-gray-900">
                        Gasss<span className="text-[#0F6E56]">Trip</span>
                        <span className="ml-1 text-sm font-normal text-gray-400">.Indonesia</span>
                    </span>
                </div>

                {/* Content */}
                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
}
