'use client';

import Link from "next/link";
import { House, LockKeyhole, UserPlus, UserRound } from "lucide-react";

export default function FooterComponent() {
    const menuItems = [
        { label: "Home", icon: House, route: "/" },
        { label: "Acessos", icon: LockKeyhole, route: "/acessos" },
        { label: "Convites", icon: UserPlus, route: "/new-invitation" },
        { label: "Perfil", icon: UserRound, route: "/perfil" },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white text-gray-600 py-4 mt-6">
            <ul className="flex flex-row justify-between px-4">
                {menuItems.map(({ label, icon: Icon, route }) => (
                    <li key={label}>
                        <Link href={route}>
                            <div className="flex flex-col items-center justify-center p-2 hover:text-blue-900 transition-colors cursor-pointer">
                                <Icon />
                                <span className="font-black">{label}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </footer>
    );
}
