'use client';

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeaderComponent() {
    const router = useRouter();

    return (
        <header className="fixed h-25 w-full bg-[#f9f9ff] p-4  text-gray-600 flex">
            <ChevronLeft className="mt-8 " size={32} strokeWidth={1.5} onClick={() => router.back()} />
        </header>
    );
}
