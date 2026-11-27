'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, House, QrCode, UserPlus } from "lucide-react";

export default function FooterComponent() {
    const pathname = usePathname();
    const menuItems = [
        { label: "Home", icon: House, route: "/home" },
        { label: "Ler QR", icon: QrCode, route: "/qr-reader" },
        { label: "Encomendas", icon: Box, route: "/packages" },
        { label: "Convites", icon: UserPlus, route: "/new-invitation" },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/90 px-4 py-3 text-slate-500 shadow-[0_-8px_30px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <ul className="mx-auto flex max-w-md items-center justify-around">
                {menuItems.map(({ label, icon: Icon, route }) => (
                    <li key={label}>
                            <Link
                                href={route}
                                aria-label={label}
                                title={label}
                                className={`flex min-w-20 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition-colors ${pathname === route
                                    ? "bg-blue-900 text-white shadow-lg shadow-blue-900/20"
                                    : "hover:bg-blue-50 hover:text-blue-900"
                                    }`}
                            >
                                <Icon size={22} strokeWidth={pathname === route ? 2.5 : 2} />
                                <span>{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </footer>
    );
}
