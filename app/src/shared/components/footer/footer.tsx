'use client';

import Link from "next/link";
import { House, QrCode, UserPlus } from "lucide-react";

export default function FooterComponent() {
    const menuItems = [
        { label: "Home", icon: House, route: "/home" },
        { label: "Ler QR", icon: QrCode, route: "/qr-reader" },
        { label: "Convites", icon: UserPlus, route: "/new-invitation" },
    ];

    return (
        <footer className="fixed h-25 bottom-0 left-0 right-0 bg-white text-gray-600 py-4 mt-6">
            <ul className="flex flex-row justify-between px-4">
                {menuItems.map(({ label, icon: Icon, route }) => (
                    <li key={label}>
                        <Link href={route} aria-label={label} title={label}>
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${route === "/qr-reader"
                                    ? "bg-blue-900 text-white shadow-md"
                                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-900"
                                    }`}
                            >
                                <Icon size={route === "/qr-reader" ? 28 : 23} strokeWidth={route === "/qr-reader" ? 2.5 : 2} />
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </footer>
    );
}
