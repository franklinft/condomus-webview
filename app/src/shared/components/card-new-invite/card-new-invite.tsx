"use client";

import { ArrowUpRight, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CardNewInvite() {

    const router = useRouter();

    function getCreateNewInvitation() {
        router.push('/new-invitation');
    }

    return (
        <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
            <div className="relative flex items-center gap-3">
                <span className="inline-flex shrink-0 rounded-2xl bg-blue-100 p-3 text-blue-700">
                    <UserPlus size={22} />
                </span>
                <div className="min-w-0 flex-1">
                    <h2 className="font-bold">Precisa liberar alguém?</h2>
                    <p className="mt-1 text-sm text-blue-800">
                        Crie um novo convite de acesso.
                    </p>
                </div>
                <button
                    className="flex shrink-0 items-center gap-1 rounded-xl bg-blue-900 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                    onClick={getCreateNewInvitation}
                >
                    Criar
                    <ArrowUpRight size={16} />
                </button>
            </div>
        </div>
    );
}
