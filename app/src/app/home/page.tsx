"use client";

import { useCallback, useEffect } from "react";
import HomeComponent from "src/domain/home/components";
import { getVisitorsSchedules } from "src/domain/home/services";
import { HeaderComponent } from "../../shared/components/header/header";
import FooterComponent from "src/shared/components/footer/footer";
import { useService } from "../../shared/hooks/use-service";

export default function HomePage() {
    const {
        fetch: fetchVisitorsSchedules,
        result,
    } = useService(
        useCallback(() => getVisitorsSchedules(), []),
    );

    useEffect(() => {
        void fetchVisitorsSchedules();
    }, [fetchVisitorsSchedules]);

    const visitorsSchedules = result.data ?? [];
    const error = result.error instanceof Error ? result.error : null;

    return (
        <>
            <HeaderComponent />
            <div className="mb-24 px-6">
                <HomeComponent
                    visitorsSchedules={visitorsSchedules}
                    isLoading={result.isLoading}
                    error={error}
                />
            </div>
            <FooterComponent />
        </>
    );
}
