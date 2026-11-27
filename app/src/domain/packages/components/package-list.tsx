import { Bell, ChevronRight, Package } from "lucide-react";
import { EmptyPackagesState } from "./package-summary";
import { PackageRecord } from "../data/package";

type PackageListProps = {
    packages: PackageRecord[];
};

const statusLabels = {
    received: "Aguardando notificação",
    notified: "Morador notificado",
    collected: "Retirada",
} as const;

export function PackageList({ packages }: PackageListProps) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                        Histórico recente
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                        Encomendas
                    </h2>
                </div>
                <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                    <Package size={22} />
                </span>
            </div>

            {packages.length === 0 ? (
                <EmptyPackagesState />
            ) : (
                <ul className="divide-y divide-slate-100">
                    {packages.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                        >
                            {item.photoUrl ? (
                                <img
                                    src={item.photoUrl}
                                    alt={`Etiqueta da encomenda de ${item.recipientName}`}
                                    className="h-14 w-14 rounded-2xl object-cover"
                                />
                            ) : (
                                <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                                    <Package size={20} />
                                </span>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-slate-900">
                                    {item.recipientName}
                                </p>
                                <p className="mt-1 truncate text-sm text-slate-500">
                                    Apto {item.apartment} · {item.trackingCode}
                                </p>
                                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                                    <Bell size={13} />
                                    {statusLabels[item.status]}
                                </span>
                            </div>
                            <ChevronRight className="shrink-0 text-slate-400" size={18} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
