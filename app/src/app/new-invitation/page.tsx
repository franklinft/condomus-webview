'use client';

import {
    Ban,
    CheckCircle2,
    Clock3,
    HardHat,
    LoaderCircle,
    Motorbike,
    Share2,
    ShieldCheck,
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
import { AuthGuard } from "src/shared/components/auth-guard/auth-guard";

type NewInvitationForm = {
    visitorName: string;
    visitorType: "Convidado" | "Prestador" | "Delivery";
    additionalInfo: string;
    authorizationMode: "arrival" | "preauthorized";
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
            authorizationMode: "arrival",
        },
    });

    const selectedType = watch("visitorType");
    const selectedAuthorizationMode = watch("authorizationMode");

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
        `relative flex min-w-0 flex-1 flex-col items-center gap-2 rounded-2xl border p-3 text-sm font-bold transition-all ${selectedType === type
            ? "border-blue-700 bg-blue-50 text-blue-900 ring-2 ring-blue-100"
            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
        }`;

    return (
        <AuthGuard>
            <HeaderComponent />

            <main className="mx-auto mt-28 max-w-xl overflow-x-hidden px-4 pb-28">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                        Controle de acessos
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Novo convite
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Crie um acesso seguro e defina como a entrada será autorizada.
                    </p>
                </div>

                {createInvitationResult.data ? (
                    <div className="flex w-full min-w-0 flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-center">
                            <span className="mx-auto mb-3 inline-flex rounded-full bg-green-100 p-3 text-green-700">
                                <CheckCircle2 size={24} />
                            </span>
                            <h2 className="text-xl font-bold text-slate-950">
                                {isRevoked ? "Convite revogado" : "Convite criado"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
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

                                <p className="text-center text-sm text-slate-500">
                                    Válido até{" "}
                                    {new Date(
                                        createInvitationResult.data.expiresAt,
                                    ).toLocaleString("pt-BR")}
                                </p>

                                <a
                                    href={createInvitationResult.data.publicUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="max-w-full break-all rounded-2xl bg-slate-50 p-3 text-center text-sm text-blue-700 underline"
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
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-3 font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
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
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 py-3 font-bold text-white transition-colors hover:bg-blue-800"
                                >
                                    <Share2 />
                                    Compartilhar pelo WhatsApp
                                </button>

                            </>
                        )}
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                            <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                                <User size={22} />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                    Dados do acesso
                                </p>
                                <h2 className="mt-1 text-lg font-bold text-slate-950">
                                    Quem vai entrar?
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Informe os dados para a portaria identificar o visitante.
                                </p>
                            </div>
                        </div>

                        {Boolean(createInvitationResult.error) && (
                            <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                                Não foi possível criar o convite.
                            </p>
                        )}

                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Nome do visitante
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: João da Silva"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            {...register("visitorName", {
                                required: "Nome do visitante é obrigatório",
                            })}
                        />

                        {errors.visitorName && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.visitorName.message}
                            </p>
                        )}

                        <label className="mb-2 mt-7 block text-sm font-bold text-slate-700">
                            Tipo de visitante
                        </label>

                        <div className="flex min-w-0 gap-2">
                            <button
                                type="button"
                                aria-pressed={selectedType === "Convidado"}
                                className={getButtonClass("Convidado")}
                                onClick={() =>
                                    setValue("visitorType", "Convidado")
                                }
                            >
                                <User size={20} />
                                Convidado
                                {selectedType === "Convidado" && (
                                    <CheckCircle2
                                        className="absolute right-2 top-2 text-blue-700"
                                        size={16}
                                    />
                                )}
                            </button>

                            <button
                                type="button"
                                aria-pressed={selectedType === "Prestador"}
                                className={getButtonClass("Prestador")}
                                onClick={() =>
                                    setValue("visitorType", "Prestador")
                                }
                            >
                                <HardHat size={20} />
                                Prestador
                                {selectedType === "Prestador" && (
                                    <CheckCircle2
                                        className="absolute right-2 top-2 text-blue-700"
                                        size={16}
                                    />
                                )}
                            </button>

                            <button
                                type="button"
                                aria-pressed={selectedType === "Delivery"}
                                className={getButtonClass("Delivery")}
                                onClick={() =>
                                    setValue("visitorType", "Delivery")
                                }
                            >
                                <Motorbike size={20} />
                                Delivery
                                {selectedType === "Delivery" && (
                                    <CheckCircle2
                                        className="absolute right-2 top-2 text-blue-700"
                                        size={16}
                                    />
                                )}
                            </button>
                        </div>

                        <label className="mb-2 mt-7 block text-sm font-bold text-slate-700">
                            Observações{" "}
                            <span className="font-normal text-slate-400">
                                (opcional)
                            </span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Ex: visitante autorizado para entregar uma encomenda"
                            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            {...register("additionalInfo")}
                        />

                        <fieldset className="mt-7 min-w-0 border-t border-slate-100 pt-6">
                            <legend className="mb-2 block text-sm font-bold text-slate-700">
                                Como liberar a entrada?
                            </legend>
                            <p className="mb-3 text-sm text-slate-500">
                                Escolha quando a portaria poderá validar este convite.
                            </p>
                            <label className={`mb-3 flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${selectedAuthorizationMode === "arrival"
                                ? "border-amber-400 bg-amber-50 ring-2 ring-amber-100"
                                : "border-slate-200 bg-slate-50"
                                }`}>
                                <input
                                    type="radio"
                                    value="arrival"
                                    {...register("authorizationMode")}
                                />
                                <Clock3 className="mt-0.5 shrink-0 text-amber-600" size={20} />
                                <span className="min-w-0 break-words">
                                    <strong className="block text-slate-900">
                                        Confirmar na chegada
                                    </strong>
                                    <span className="text-sm text-slate-500">
                                        Você decide quando o visitante estiver na portaria.
                                    </span>
                                </span>
                            </label>
                            <label className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${selectedAuthorizationMode === "preauthorized"
                                ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                                : "border-slate-200 bg-slate-50"
                                }`}>
                                <input
                                    type="radio"
                                    value="preauthorized"
                                    {...register("authorizationMode")}
                                />
                                <ShieldCheck className="mt-0.5 shrink-0 text-blue-700" size={20} />
                                <span className="min-w-0 break-words">
                                    <strong className="block text-slate-900">
                                        Liberar previamente
                                    </strong>
                                    <span className="text-sm text-slate-500">
                                        A entrada já ficará autorizada na criação do convite.
                                    </span>
                                </span>
                            </label>
                        </fieldset>

                        <div className="mt-6 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-blue-700" size={18} />
                                <span>
                                    {selectedAuthorizationMode === "arrival"
                                        ? "A portaria solicitará sua confirmação na chegada."
                                        : "A portaria poderá validar o acesso imediatamente."}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={createInvitationResult.isLoading}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-900 py-3.5 font-bold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
                        >
                            {createInvitationResult.isLoading ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Share2 />
                            )}
                            {createInvitationResult.isLoading
                                ? "Criando convite..."
                                : "Gerar QR Code do convite"}
                        </button>
                    </form>
                )}
            </main>
        </AuthGuard>
    );
}
