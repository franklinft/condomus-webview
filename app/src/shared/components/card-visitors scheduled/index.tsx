'use client';

import {
    VisitorAccessStatus,
    VisitorSchedule,
    VisitorType,
} from "../../../domain/home/data/data-visitors-scheduled";
import { visitorIcons } from "../../utils/visitor-icon";
import {
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clock3,
    LoaderCircle,
    ShieldCheck,
    XCircle,
} from "lucide-react";

type CardVisitorsScheduledProps = {
    visitorsSchedules: VisitorSchedule[];
    isLoading: boolean;
    error: Error | null;
};

export function CardVisitorsScheduled({
    visitorsSchedules,
    isLoading,
    error,
}: CardVisitorsScheduledProps) {
    const getVisitorIcon = (type: VisitorType) => {
        const IconComponent = visitorIcons[type];
        return <IconComponent size={24} color="#1E40AF" />;
    };

    const accessStatusLabel: Record<VisitorAccessStatus, string> = {
        pending: "Pendente",
        preauthorized: "Liberado previamente",
        awaiting_confirmation: "Aguardando confirmação",
        validated: "Liberado",
        revoked: "Revogado",
        expired: "Expirado",
        denied: "Recusado",
    };

    const accessStatusIcon: Record<
        VisitorAccessStatus,
        typeof CheckCircle2
    > = {
        pending: Clock3,
        preauthorized: ShieldCheck,
        awaiting_confirmation: CircleAlert,
        validated: CheckCircle2,
        revoked: XCircle,
        expired: XCircle,
        denied: XCircle,
    };

    const accessStatusClass: Record<VisitorAccessStatus, string> = {
        pending: "bg-gray-100 text-gray-700",
        preauthorized: "bg-blue-100 text-blue-800",
        awaiting_confirmation: "bg-amber-100 text-amber-800",
        validated: "bg-green-100 text-green-800",
        revoked: "bg-red-100 text-red-800",
        expired: "bg-red-100 text-red-800",
        denied: "bg-red-100 text-red-800",
    };

    if (error) {
        return (
            <div className="bg-white p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-2">Visitantes Agendados</h2>
                <p className="text-red-500">Erro ao carregar os visitantes agendados.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-32 flex items-center justify-center">
                <LoaderCircle className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                        Controle de acessos
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                        Visitantes agendados
                    </h2>
                </div>
                <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <CalendarDays size={22} />
                </span>
            </div>
            <p className="mb-4 text-sm text-slate-500">
                Acompanhe quem está autorizado a entrar no condomínio.
            </p>
            <ul className="divide-y divide-slate-100">
                {visitorsSchedules.length === 0 && (
                    <li className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                        Nenhum visitante agendado
                    </li>
                )}
                {visitorsSchedules.map((schedule) => {
                    const accessStatus = schedule.accessStatus ?? "pending";
                    const StatusIcon = accessStatusIcon[accessStatus];

                    return (
                        <li className="flex items-start gap-3 py-4 first:pt-3 last:pb-2" key={schedule.id}>
                            <span className="rounded-2xl bg-blue-50 p-3">
                                {getVisitorIcon(schedule.type)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">
                                            {schedule.name}
                                        </p>
                                        {schedule.apartment && (
                                            <p className="mt-1 text-sm text-slate-500">
                                                Apto {schedule.apartment}
                                                {schedule.block && ` · Bloco ${schedule.block}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="flex items-center gap-1 text-sm font-bold text-blue-900">
                                            <Clock3 size={14} />
                                            {schedule.time}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">{schedule.day}</p>
                                    </div>
                                </div>
                                <span
                                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${accessStatusClass[accessStatus]}`}
                                >
                                    <StatusIcon size={14} />
                                    {accessStatusLabel[accessStatus]}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 font-bold text-blue-900 transition-colors hover:bg-blue-100"
            >
                Ver Visitantes Agendados
                <ChevronRight size={18} />
            </button>
        </div>
    );
}
