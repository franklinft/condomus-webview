"use client";

import { Camera, CheckCircle2, LoaderCircle, MessageCircle, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useService } from "src/shared/hooks/use-service";
import {
    validateVisitorInvitation,
} from "src/domain/visitor-qr/services/invitations";
import { ValidateVisitorInvitationData } from "src/domain/visitor-qr/data/invitation";
import { HeaderComponent } from "src/shared/components/header/header";

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
        (validationResult.data?.valid && validatedInvitation
            ? `https://wa.me/5582996249378?text=${encodeURIComponent(
                [
                    "Condomus: visitante chegou.",
                    `Visitante: ${validatedInvitation.visitorName}.`,
                    "Acesso liberado pela portaria.",
                ].join("\n"),
            )}`
            : null);

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
        <>
            <HeaderComponent />

            <main className="mt-30 px-6 pb-24">
                <h1 className="text-3xl text-blue-900 font-bold">
                    Ler QR Code
                </h1>
                <p className="mb-8">
                    Aponte a câmera para o QR Code do visitante.
                </p>

                <div className="overflow-hidden rounded-2xl bg-black">
                    <video
                        ref={videoRef}
                        muted
                        playsInline
                        className="aspect-square w-full object-cover"
                    />
                </div>

                {!isReaderReady && !readerError && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                        <LoaderCircle className="animate-spin" size={18} />
                        Iniciando câmera...
                    </div>
                )}

                {(readerError ||
                    !supportsBarcodeDetector) && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-100 p-4 text-red-700">
                        <Camera size={20} />
                        {readerError ||
                            "Seu navegador não oferece suporte à leitura de QR Code."}
                    </div>
                )}

                {validationResult.isLoading && (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-blue-100 p-4 text-blue-900">
                        <LoaderCircle className="animate-spin" size={20} />
                        Validando convite...
                    </div>
                )}

                {validationResult.data?.valid && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-green-100 p-4 text-green-900">
                        <CheckCircle2 size={20} />
                        <div>
                            <p className="font-bold">{validationResult.data.message}</p>
                            {validationResult.data.invitation && (
                                <p>
                                    {validationResult.data.invitation.visitorName} ·{" "}
                                    {validationResult.data.invitation.visitorType}
                                </p>
                            )}
                            {residentWhatsappUrl && (
                                <a
                                    href={residentWhatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 font-semibold text-white"
                                >
                                    <MessageCircle size={18} />
                                    Avisar pelo WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {Boolean(validationResult.error) && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-100 p-4 text-red-700">
                        <XCircle size={20} />
                        Não foi possível validar o convite.
                    </div>
                )}

                {validationResult.data &&
                    !validationResult.data.valid && (
                        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-100 p-4 text-red-700">
                            <XCircle size={20} />
                            {validationResult.data.message}
                        </div>
                    )}
            </main>
        </>
    );
}
