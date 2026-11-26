"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Suspense, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useService } from "src/shared/hooks/use-service";
import { getPublicVisitorInvitation } from "src/domain/visitor-qr/services/invitations";
import { QrCode } from "src/domain/visitor-qr/components/qr-code";

function VisitorAccessContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const publicUrl =
        typeof window !== "undefined" && token
            ? window.location.href
            : null;
    const {
        fetch: fetchPublicInvitation,
        result,
    } = useService(
        useCallback(
            (invitationToken: string) =>
                getPublicVisitorInvitation(invitationToken),
            [],
        ),
    );

    useEffect(() => {
        if (token) {
            void fetchPublicInvitation(token);
        }
    }, [fetchPublicInvitation, token]);

    return (
        <main className="min-h-screen flex flex-col justify-center px-6 py-12">
            <div className="w-full max-w-md mx-auto rounded-2xl bg-white p-6 text-center">
                <h1 className="text-3xl font-bold text-blue-900">
                    Convite Condomus
                </h1>

                {!token && (
                    <div className="mt-6 flex items-center gap-2 rounded-2xl bg-red-100 p-4 text-left text-red-700">
                        <AlertCircle size={20} />
                        Link de convite inválido.
                    </div>
                )}

                {result.isLoading && (
                    <p className="mt-6 text-gray-600">Carregando convite...</p>
                )}

                {Boolean(result.error) && (
                    <div className="mt-6 flex items-center gap-2 rounded-2xl bg-red-100 p-4 text-left text-red-700">
                        <AlertCircle size={20} />
                        Não foi possível carregar este convite.
                    </div>
                )}

                {result.data && (
                    <div className="mt-6">
                        {result.data.status === "pending" && publicUrl && (
                            <>
                                <p className="mb-4 text-gray-600">
                                    Apresente este QR Code na portaria.
                                </p>
                                <QrCode value={publicUrl} />
                            </>
                        )}

                        {result.data.status === "pending" ? (
                            <CheckCircle2
                                className="mx-auto mt-6 text-green-600"
                                size={40}
                            />
                        ) : (
                            <AlertCircle
                                className="mx-auto text-red-600"
                                size={40}
                            />
                        )}
                        <p className="mt-4 text-lg font-bold">
                            {result.data.visitorName}
                        </p>
                        <p className="text-gray-600">
                            {result.data.visitorType}
                        </p>
                        <p className="mt-4 text-sm text-gray-500">
                            Válido até{" "}
                            {new Date(result.data.expiresAt).toLocaleString(
                                "pt-BR",
                            )}
                        </p>
                        {result.data.status !== "pending" && (
                            <p className="mt-4 text-red-600">
                                Este convite não está mais disponível para acesso.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

export default function VisitorAccessPage() {
    return (
        <Suspense fallback={<p className="p-6 text-center">Carregando convite...</p>}>
            <VisitorAccessContent />
        </Suspense>
    );
}
