"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    clearAuthSession,
    getAuthSession,
} from "src/domain/auth/services/session";

type AuthGuardProps = {
    children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const session = getAuthSession();
        const expiresAt = session?.expiresAt
            ? new Date(session.expiresAt).getTime()
            : 0;

        if (!session || !session.accessToken || expiresAt <= Date.now()) {
            clearAuthSession();
            router.replace("/login");
            return;
        }

        setIsAuthorized(true);
    }, [router]);

    if (!isAuthorized) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
                <p className="text-sm font-medium text-slate-500">
                    Verificando sessão...
                </p>
            </main>
        );
    }

    return children;
}
