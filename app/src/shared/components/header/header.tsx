'use client';

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeaderComponent() {
    const router = useRouter();

    return (
        <header className="bg-[#f9f9ff] p-4 text-gray-600 flex">
            <ChevronLeft size={40} strokeWidth={1.5} onClick={() => router.back()} />
        </header>
    );
}
