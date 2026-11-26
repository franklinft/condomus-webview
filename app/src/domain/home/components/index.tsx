import { ShieldCheck } from "lucide-react";
import { CardNewInvite } from "../../../shared/components/card-new-invite/card-new-invite";
import { CardVisitorsScheduled } from "../../../shared/components/card-visitors scheduled";
import { VisitorSchedule } from "../data/data-visitors-scheduled";

type HomeComponentProps = {
    visitorsSchedules: VisitorSchedule[];
    isLoading: boolean;
    error: Error | null;
};

export default function HomeComponent({
    visitorsSchedules,
    isLoading,
    error,
}: HomeComponentProps) {

    return (
        <div className="mt-30">
            <h1 className="text-3xl font-bold">Olá, Franklin!</h1>
            <p className="mb-4">Bem vindo de volta ao seu painel de controle</p>

            <div className="flex items-center gap-2 mb-4 bg-green-300 p-4 rounded-2xl">
                <ShieldCheck />
                <p className="text-green-900">
                    PORTARIA: PROTEGIDA
                </p>
            </div>
            <div className="pb-4">
                <CardNewInvite />
            </div>
            <div className="pb-4">
                <CardVisitorsScheduled
                    visitorsSchedules={visitorsSchedules}
                    isLoading={isLoading}
                    error={error}
                />
            </div>
        </div>
    );
}
