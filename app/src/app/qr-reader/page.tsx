"use client";

import { Camera, CheckCircle2, LoaderCircle, MessageCircle, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useService } from "src/shared/hooks/use-service";
import {
    validateVisitorInvitation,
} from "src/domain/visitor-qr/services/invitations";
import { ValidateVisitorInvitationData } from "src/domain/visitor-qr/data/invitation";
import { HeaderComponent } from "src/shared/components/header/header";
import { AuthGuard } from "src/shared/components/auth-guard/auth-guard";

type BarcodeDetectorInstance = {
    detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};

type BarcodeDetectorConstructor = new (options?: {
    formats?: string[];
}) => BarcodeDetectorInstance;

type BarcodeDetectorWindow = Window & {
    BarcodeDetector?: BarcodeDetectorConstructor;
};

export default function QrReaderPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastScannedTokenRef = useRef<string | null>(null);
    const [readerError, setReaderError] = useState<string | null>(null);
    const [isReaderReady, setReaderReady] = useState(false);
    const supportsBarcodeDetector =
        typeof window !== "undefined" &&
        "BarcodeDetector" in window;

    const {
        fetch: fetchValidateInvitation,
        result: validationResult,
    } = useService(
        useCallback(
            (data: ValidateVisitorInvitationData) =>
                validateVisitorInvitation(data),
            [],
        ),
    );
    const validatedInvitation = validationResult.data?.invitation;
    const residentWhatsappUrl =
        validationResult.data?.residentWhatsappUrl ||
        ((validationResult.data?.valid ||
            validationResult.data?.requiresResidentConfirmation) &&
            validatedInvitation
            ? `https://wa.me/5582996883163?text=${encodeURIComponent(
                [
                    validationResult.data.requiresResidentConfirmation
                        ? "🏠 *Confirmação de entrada - Condomus*"
                        : "🏠 *Atualização Condomus*",
                    "",
                    "Olá, morador!",
                    `O visitante ${validatedInvitation.visitorName} chegou à portaria.`,
                    "",
                    "👤 *Dados do visitante*",
                    `Nome: ${validatedInvitation.visitorName}`,
                    `Tipo: ${validatedInvitation.visitorType}`,
                    validatedInvitation.additionalInfo
                        ? `Observação: ${validatedInvitation.additionalInfo}`
                        : null,
                    "",
                    "📍 *Acesso*",
                    `Apartamento: ${validatedInvitation.apartment ?? "não informado"}${validatedInvitation.block ? ` · Bloco ${validatedInvitation.block}` : ""}`,
                    `⏰ Validado em: ${new Date().toLocaleString("pt-BR")}`,
                    validationResult.data.requiresResidentConfirmation
                        ? "Acesse o Condomus para confirmar ou recusar a entrada."
                    : "✅ Acesso autorizado pelo morador. Entrada validada.",
                ].filter((line): line is string => Boolean(line)).join("\n"),
            )}`
            : null);

    const handleRetryScan = () => {
        lastScannedTokenRef.current = null;
    };

    const handleCode = useCallback(
        (rawValue: string) => {
            if (validationResult.isLoading) {
                return;
            }

            let token = rawValue;

            try {
                token = new URL(rawValue).searchParams.get("token") ?? rawValue;
            } catch {
                // QR Code pode conter o token diretamente.
            }

            if (
                !token ||
                token === lastScannedTokenRef.current
            ) {
                return;
            }

            lastScannedTokenRef.current = token;
            void fetchValidateInvitation({
                token,
                validationId: crypto.randomUUID(),
                validatedAt: new Date().toISOString(),
            });
        },
        [fetchValidateInvitation, validationResult.isLoading],
    );

    useEffect(() => {
        let isActive = true;
        const detectorConstructor = (window as BarcodeDetectorWindow)
            .BarcodeDetector;

        if (!detectorConstructor) {
            return;
        }

        const startReader = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                    audio: false,
                });

                if (!isActive || !videoRef.current) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setReaderReady(true);

                const detector = new detectorConstructor({
                    formats: ["qr_code"],
                });

                const scan = async () => {
                    if (!isActive || !videoRef.current) {
                        return;
                    }

                    const detectedCodes = await detector.detect(videoRef.current);
                    const token = detectedCodes[0]?.rawValue;

                    if (token) {
                        handleCode(token);
                    }

                    animationFrameRef.current =
                        window.requestAnimationFrame(() => void scan());
                };

                void scan();
            } catch {
                setReaderError(
                    "Não foi possível acessar a câmera. Verifique a permissão do navegador.",
                );
            }
        };

        void startReader();

        return () => {
            isActive = false;

            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
            }

            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, [handleCode]);

    return (
        <AuthGuard>
            <HeaderComponent />

            <main className="mx-auto mt-28 max-w-xl overflow-x-hidden px-4 pb-28">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                        Controle de acessos
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Validar entrada
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Aponte a câmera para o QR Code apresentado pelo visitante.
                    </p>
                </div>

                <section className="rounded-3xl bg-slate-950 p-3 shadow-xl shadow-slate-900/15">
                    <div className="relative overflow-hidden rounded-2xl bg-black">
                        <video
                            ref={videoRef}
                            muted
                            playsInline
                            className="aspect-square w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-white/70" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                            {isReaderReady ? "Câmera pronta" : "Iniciando câmera"}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-2 pb-1 pt-3 text-sm text-slate-300">
                        <Camera size={16} />
                        Posicione o código dentro da moldura
                    </div>
                </section>

                {!isReaderReady && !readerError && (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-slate-100 p-3 text-sm text-slate-600">
                        <LoaderCircle className="animate-spin" size={18} />
                        Preparando a câmera...
                    </div>
                )}

                {(readerError || !supportsBarcodeDetector) && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <Camera className="mt-0.5 shrink-0" size={20} />
                        <span>
                            {readerError ||
                                "Seu navegador não oferece suporte à leitura de QR Code."}
                        </span>
                    </div>
                )}

                {validationResult.isLoading && (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-900">
                        <LoaderCircle className="animate-spin" size={20} />
                        Validando convite...
                    </div>
                )}

                {validationResult.data?.requiresResidentConfirmation && (
                    <section className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
                        <div className="flex items-start gap-3">
                            <span className="rounded-2xl bg-amber-100 p-2 text-amber-700">
                                <MessageCircle size={20} />
                            </span>
                            <div>
                                <p className="font-bold">Confirmação necessária</p>
                                <p className="mt-1 text-sm text-amber-800">
                                    O visitante foi identificado, mas o morador ainda precisa liberar a entrada.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            {residentWhatsappUrl && (
                                <a
                                    href={residentWhatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white"
                                >
                                    <MessageCircle size={18} />
                                    Avisar o morador
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={handleRetryScan}
                                className="rounded-2xl border border-amber-300 px-4 py-3 font-bold text-amber-900"
                            >
                                Ler novamente após confirmação
                            </button>
                        </div>
                    </section>
                )}

                {validationResult.data?.valid && (
                    <section className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
                        <div className="flex items-start gap-3">
                            <span className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                                <CheckCircle2 size={22} />
                            </span>
                            <div className="min-w-0">
                                <p className="font-bold">{validationResult.data.message}</p>
                                {validatedInvitation && (
                                    <p className="mt-1 text-sm text-emerald-800">
                                        {validatedInvitation.visitorName} ·{" "}
                                        {validatedInvitation.visitorType}
                                    </p>
                                )}
                            </div>
                        </div>
                        {residentWhatsappUrl && (
                            <a
                                href={residentWhatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white"
                            >
                                <MessageCircle size={18} />
                                Avisar o morador
                            </a>
                        )}
                    </section>
                )}

                {Boolean(validationResult.error) && (
                    <div className="mt-4 flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        <XCircle className="mt-0.5 shrink-0" size={20} />
                        <span>Não foi possível validar o convite.</span>
                    </div>
                )}

                {validationResult.data && !validationResult.data.valid && (
                    <div className="mt-4 flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        <XCircle className="mt-0.5 shrink-0" size={20} />
                        <span>{validationResult.data.message}</span>
                    </div>
                )}
            </main>
        </AuthGuard>
    );
}
