import { Bell, Package, PackageCheck, PackageOpen } from "lucide-react";

type PackageSummaryProps = {
    pendingCount: number;
    notifiedCount: number;
    collectedCount: number;
};

export function PackageSummary({
    pendingCount,
    notifiedCount,
    collectedCount,
}: PackageSummaryProps) {
    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <Package className="text-blue-700" size={20} />
                <p className="mt-3 text-2xl font-bold text-slate-950">
                    {pendingCount}
                </p>
                <p className="text-xs font-medium text-slate-500">
                    Aguardando
                </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <Bell className="text-amber-600" size={20} />
                <p className="mt-3 text-2xl font-bold text-slate-950">
                    {notifiedCount}
                </p>
                <p className="text-xs font-medium text-slate-500">
                    Notificados
                </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <PackageCheck className="text-emerald-600" size={20} />
                <p className="mt-3 text-2xl font-bold text-slate-950">
                    {collectedCount}
                </p>
                <p className="text-xs font-medium text-slate-500">
                    Retirados
                </p>
            </div>
        </div>
    );
}

export function EmptyPackagesState() {
    return (
        <div className="rounded-2xl bg-slate-50 p-5 text-center">
            <PackageOpen className="mx-auto text-slate-400" size={28} />
            <p className="mt-2 font-semibold text-slate-700">
                Nenhuma encomenda registrada
            </p>
            <p className="mt-1 text-sm text-slate-500">
                As encomendas recebidas aparecerão aqui.
            </p>
        </div>
    );
}
