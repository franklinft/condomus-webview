"use client";

import { useCallback, useEffect } from "react";
import HomeComponent from "src/domain/home/components";
import { getVisitorsSchedules } from "src/domain/home/services";
import { HeaderComponent } from "../../shared/components/header/header";
import FooterComponent from "src/shared/components/footer/footer";
import { useService } from "../../shared/hooks/use-service";
import {
    authorizeVisitorInvitation,
    getPendingAuthorizations,
} from "src/domain/visitor-qr/services/invitations";

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

    const {
        fetch: fetchPendingAuthorizations,
        result: pendingAuthorizationsResult,
    } = useService(useCallback(() => getPendingAuthorizations(), []));
    const {
        fetch: fetchAuthorizeInvitation,
    } = useService(
        useCallback(
            (invitationId: string, authorized: boolean) =>
                authorizeVisitorInvitation({ invitationId, authorized }),
            [],
        ),
    );

    useEffect(() => {
        void fetchPendingAuthorizations();
        const interval = window.setInterval(() => {
            void fetchPendingAuthorizations();
        }, 5000);

        return () => window.clearInterval(interval);
    }, [fetchPendingAuthorizations]);

    const handleAuthorizeInvitation = useCallback(
        (invitationId: string, authorized: boolean) => {
            void fetchAuthorizeInvitation(invitationId, authorized).then(() => {
                void fetchPendingAuthorizations();
            });
        },
        [fetchAuthorizeInvitation, fetchPendingAuthorizations],
    );

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
                    pendingAuthorizations={pendingAuthorizationsResult.data ?? []}
                    onAuthorizeInvitation={handleAuthorizeInvitation}
                />
            </div>
            <FooterComponent />
        </>
    );
}
