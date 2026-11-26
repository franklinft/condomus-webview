'use client';

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeaderComponent() {
    const router = useRouter();

    return (
        <header className="fixed inset-x-0 top-0 z-40 h-20 min-h-20 overflow-hidden border-b border-slate-200 bg-[#f9f9ff]">
            <div className="flex h-full items-center justify-between px-5">
                <button
                    type="button"
                    aria-label="Voltar"
                    onClick={() => router.back()}
                    className="rounded-2xl p-2 text-slate-600 transition-colors hover:bg-white hover:text-blue-900"
                >
                    <ChevronLeft size={28} strokeWidth={1.8} />
                </button>
                <span className="text-lg font-black tracking-tight text-blue-900">
                    condomus
                </span>
                <span className="w-10" aria-hidden="true" />
            </div>
        </header>
    );
}
