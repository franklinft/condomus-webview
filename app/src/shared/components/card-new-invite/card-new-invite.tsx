"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CardNewInvite() {

    const router = useRouter();

    function getCreateNewInvitation() {
        router.push('/new-invitation');
    }

    return (
        <div className="bg-blue-900 text-white p-6 border rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Novo Convite</h2>
            <p>Crie convites temporários ou permanentes para visitantes e prestadores de serviço com facilidade.</p>
            <button
                className="flex items-center justify-center mt-4 px-4 py-2 bg-white 
                text-blue-900 rounded-4xl w-max"
                onClick={getCreateNewInvitation}>
                <UserPlus className="mr-2" /> Criar Novo Convite
            </button>
        </div>
    );
}
