import { CalendarDays, Clock3, ShieldCheck, Users } from "lucide-react";
import { CardNewInvite } from "../../../shared/components/card-new-invite/card-new-invite";
import { CardVisitorsScheduled } from "../../../shared/components/card-visitors scheduled";
import { VisitorSchedule } from "../data/data-visitors-scheduled";
import { VisitorInvitation } from "../../visitor-qr/data/invitation";

type HomeComponentProps = {
    visitorsSchedules: VisitorSchedule[];
    isLoading: boolean;
    error: Error | null;
    pendingAuthorizations: VisitorInvitation[];
    onAuthorizeInvitation: (invitationId: string, authorized: boolean) => void;
};

export default function HomeComponent({
    visitorsSchedules,
    isLoading,
    error,
    pendingAuthorizations,
    onAuthorizeInvitation,
}: HomeComponentProps) {
    const pendingCount = pendingAuthorizations.length;
    const activeCount = visitorsSchedules.filter((schedule) =>
        ["pending", "preauthorized", "awaiting_confirmation"].includes(
            schedule.accessStatus ?? "pending",
        ),
    ).length;
    const validatedCount = visitorsSchedules.filter(
        (schedule) => schedule.accessStatus === "validated",
    ).length;

    return (
        <div className="mt-30 space-y-5">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                    Painel do morador
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-950">
                    Olá, Franklin!
                </h1>
                <p className="mt-2 text-slate-500">
                    Bem-vindo de volta ao seu painel de controle.
                </p>
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                        <ShieldCheck />
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Segurança
                        </p>
                        <p className="font-bold text-emerald-950">
                            Portaria protegida
                        </p>
                    </div>
                </div>
                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <Users className="text-blue-700" size={20} />
                    <p className="mt-3 text-2xl font-bold text-slate-950">
                        {activeCount}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                        Acessos ativos
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <Clock3 className="text-amber-600" size={20} />
                    <p className="mt-3 text-2xl font-bold text-slate-950">
                        {pendingCount}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                        Pendentes
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <CalendarDays className="text-emerald-600" size={20} />
                    <p className="mt-3 text-2xl font-bold text-slate-950">
                        {validatedCount}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                        Entradas hoje
                    </p>
                </div>
            </div>

            <div>
                {pendingAuthorizations.map((invitation) => (
                    <div
                        key={invitation.id}
                        className="mb-4 rounded-2xl bg-amber-100 p-4 text-amber-950"
                    >
                        <strong className="block">Confirme a entrada</strong>
                        <p className="mt-1">
                            {invitation.visitorName} está aguardando liberação na
                            portaria.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    onAuthorizeInvitation(invitation.id, true)
                                }
                                className="flex-1 rounded-xl bg-green-600 px-3 py-2 font-semibold text-white"
                            >
                                Liberar entrada
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onAuthorizeInvitation(invitation.id, false)
                                }
                                className="flex-1 rounded-xl border border-red-500 px-3 py-2 font-semibold text-red-700"
                            >
                                Recusar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <CardVisitorsScheduled
                    visitorsSchedules={visitorsSchedules}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
            <CardNewInvite />
        </div>
    );
}
