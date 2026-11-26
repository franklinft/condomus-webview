'use client';

import {
    Ban,
    HardHat,
    LoaderCircle,
    Motorbike,
    Share2,
    User,
} from "lucide-react";
import { HeaderComponent } from "src/shared/components/header/header";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useService } from "src/shared/hooks/use-service";
import {
    createVisitorInvitation,
    revokeVisitorInvitation,
} from "src/domain/visitor-qr/services/invitations";
import { QrCode } from "src/domain/visitor-qr/components/qr-code";

type NewInvitationForm = {
    visitorName: string;
    visitorType: "Convidado" | "Prestador" | "Delivery";
    additionalInfo: string;
};

export default function NewInvitationPage() {
    const {
        fetch: fetchCreateInvitation,
        result: createInvitationResult,
    } = useService(
        useCallback((data: NewInvitationForm) => createVisitorInvitation(data), []),
    );
    const {
        fetch: fetchRevokeInvitation,
        result: revokeInvitationResult,
    } = useService(
        useCallback(
            (invitationId: string) =>
                revokeVisitorInvitation({ invitationId }),
            [],
        ),
    );
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<NewInvitationForm>({
        defaultValues: {
            visitorName: "",
            visitorType: "Convidado",
            additionalInfo: "",
        },
    });

    const selectedType = watch("visitorType");

    const onSubmit = (data: NewInvitationForm) => {
        void fetchCreateInvitation(data);
    };

    const invitation = revokeInvitationResult.data ?? createInvitationResult.data;
    const isRevoked = invitation?.status === "revoked";

    const handleRevoke = () => {
        const invitationId = createInvitationResult.data?.id;

        if (invitationId) {
            void fetchRevokeInvitation(invitationId);
        }
    };

    const handleShare = () => {
        const invitation = createInvitationResult.data;

        if (!invitation) {
            return;
        }

        const publicUrl = new URL(
            invitation.publicUrl,
            window.location.origin,
        ).toString();
        const expiresAt = new Date(invitation.expiresAt).toLocaleString(
            "pt-BR",
        );
        const shareText = [
            "🏠 *Convite Condomus*",
            "",
            `Olá, ${invitation.visitorName}!`,
            "Você recebeu um convite para acessar o condomínio.",
            "",
            "📲 *Abra o link e apresente o QR Code na portaria:*",
            "",
            publicUrl,
            "",
            `⏰ Válido até: ${expiresAt}`,
            "",
            "Não compartilhe este link com outras pessoas.",
        ].join("\n");
        window.location.assign(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
        );
    };

    const getButtonClass = (type: string) =>
        `font-bold flex flex-col p-4 items-center rounded-2xl transition-colors cursor-pointer ${selectedType === type
            ? "bg-blue-900 text-white"
            : "bg-white border border-gray-300 text-blue-900"
        }`;

    return (
        <>
            <HeaderComponent />

            <div className="mt-30 px-6">
                <h1 className="text-3xl text-blue-900 font-bold">
                    Novo Convite
                </h1>

                <p className="mb-8">
                    Crie um acesso temporário para seus visitantes
                </p>

                {createInvitationResult.data ? (
                    <div className="flex flex-col items-center gap-6 bg-white rounded-2xl p-6">
                        <div className="text-center">
                            <h2 className="text-xl text-blue-900 font-bold">
                                {isRevoked ? "Convite revogado" : "Convite criado"}
                            </h2>
                            <p className="text-gray-600">
                                {isRevoked
                                    ? "Este QR Code não libera mais o acesso."
                                    : "Compartilhe este QR Code com o visitante."}
                            </p>
                        </div>

                        {!isRevoked && (
                            <>
                                <QrCode
                                    value={createInvitationResult.data.publicUrl}
                                />

                                <p className="text-center text-sm text-gray-500">
                                    Válido até{" "}
                                    {new Date(
                                        createInvitationResult.data.expiresAt,
                                    ).toLocaleString("pt-BR")}
                                </p>

                                <a
                                    href={createInvitationResult.data.publicUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="max-w-full break-all text-center text-sm text-blue-700 underline"
                                >
                                    {createInvitationResult.data.publicUrl}
                                </a>
                            </>
                        )}

                        {!isRevoked && (
                            <button
                                type="button"
                                disabled={revokeInvitationResult.isLoading}
                                onClick={handleRevoke}
                                className="flex items-center justify-center gap-2 w-full border border-red-500 text-red-600 font-bold py-3 rounded-2xl hover:bg-red-50 transition-colors disabled:opacity-60"
                            >
                                {revokeInvitationResult.isLoading ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    <Ban />
                                )}
                                Revogar convite
                            </button>
                        )}

                        {!isRevoked && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-2 w-full bg-blue-900 text-white font-bold py-3 rounded-2xl hover:bg-blue-800 transition-colors"
                                >
                                    <Share2 />
                                    Compartilhar pelo WhatsApp
                                </button>

                            </>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {Boolean(createInvitationResult.error) && (
                            <p className="mb-4 text-red-500">
                                Não foi possível criar o convite.
                            </p>
                        )}

                    <label className="block font-bold text-gray-700 mb-2">
                        Nome do visitante
                    </label>

                    <input
                        type="text"
                        placeholder="Ex: João da Silva"
                        className="border bg-white border-gray-300 rounded-2xl p-3 focus:outline-none w-full focus:ring-2 focus:ring-blue-500"
                        {...register("visitorName", {
                            required: "Nome do visitante é obrigatório",
                        })}
                    />

                    {errors.visitorName && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.visitorName.message}
                        </p>
                    )}

                    <label className="mt-8 block font-bold text-gray-700 mb-2">
                        Tipo de Visitante
                    </label>

                    <div className="flex flex-row gap-1 justify-between">
                        <button
                            type="button"
                            className={getButtonClass("Convidado")}
                            onClick={() =>
                                setValue("visitorType", "Convidado")
                            }
                        >
                            <User />
                            Convidado
                        </button>

                        <button
                            type="button"
                            className={getButtonClass("Prestador")}
                            onClick={() =>
                                setValue("visitorType", "Prestador")
                            }
                        >
                            <HardHat />
                            Prestador
                        </button>

                        <button
                            type="button"
                            className={getButtonClass("Delivery")}
                            onClick={() =>
                                setValue("visitorType", "Delivery")
                            }
                        >
                            <Motorbike />
                            Delivery
                        </button>
                    </div>

                    <textarea
                        rows={4}
                        placeholder="Informações adicionais para a portaria"
                        className="mt-8 w-full bg-white border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        {...register("additionalInfo")}
                    />

                    <button
                        type="submit"
                        disabled={createInvitationResult.isLoading}
                        className="flex items-center justify-center gap-2 mt-8 w-full bg-blue-900 text-white font-bold py-3 rounded-2xl hover:bg-blue-800 transition-colors disabled:opacity-60"
                    >
                        {createInvitationResult.isLoading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Share2 />
                        )}
                        {createInvitationResult.isLoading
                            ? "Criando convite..."
                            : "Gerar QR Code do Convite"}
                    </button>
                    </form>
                )}
            </div>
        </>
    );
}
