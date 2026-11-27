"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { HeaderComponent } from "src/shared/components/header/header";
import FooterComponent from "src/shared/components/footer/footer";
import { PackageReceiptForm } from "src/domain/packages/components/package-receipt-form";
import { PackageList } from "src/domain/packages/components/package-list";
import { PackageSummary } from "src/domain/packages/components/package-summary";
import {
    PackageRecord,
    ReceivePackageData,
} from "src/domain/packages/data/package";
import {
    createPackage,
    getPackages,
} from "src/domain/packages/services/packages";
import { getResidents } from "src/domain/packages/services/residents";
import { useService } from "src/shared/hooks/use-service";
import { AuthGuard } from "src/shared/components/auth-guard/auth-guard";

export default function PackagesPage() {
    const {
        fetch: fetchPackages,
        result: packagesResult,
    } = useService(useCallback(() => getPackages(), []));
    const {
        fetch: fetchCreatePackage,
    } = useService(
        useCallback((data: ReceivePackageData) => createPackage(data), []),
    );
    const {
        fetch: fetchResidents,
        result: residentsResult,
    } = useService(useCallback(() => getResidents(), []));

    useEffect(() => {
        void fetchPackages();
        void fetchResidents();
    }, [fetchPackages, fetchResidents]);

    const handleReceivePackage = async (data: ReceivePackageData) => {
        await fetchCreatePackage(data);
        await fetchPackages();
    };

    const packages = packagesResult.data ?? [];
    const pendingCount = packages.filter(
        (item: PackageRecord) => item.status === "received",
    ).length;
    const notifiedCount = packages.filter(
        (item: PackageRecord) => item.status === "notified",
    ).length;
    const collectedCount = packages.filter(
        (item: PackageRecord) => item.status === "collected",
    ).length;

    return (
        <AuthGuard>
            <HeaderComponent />
            <main className="mx-auto mt-28 max-w-xl overflow-x-hidden px-4 pb-28">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                        Portaria
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Encomendas
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Registre recebimentos e avise o morador com segurança.
                    </p>
                </div>

                <div className="mb-5 flex items-center gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                    <span className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                        <ShieldCheck size={22} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            Registro protegido
                        </p>
                        <p className="mt-1 text-sm font-bold text-emerald-950">
                            Dados da etiqueta preservados após o expurgo da foto.
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    <PackageSummary
                        pendingCount={pendingCount}
                        notifiedCount={notifiedCount}
                        collectedCount={collectedCount}
                    />
                    <PackageReceiptForm
                        onSubmit={handleReceivePackage}
                        residents={residentsResult.data ?? []}
                    />
                    <PackageList packages={packages} />
                </div>
            </main>
            <FooterComponent />
        </AuthGuard>
    );
}
