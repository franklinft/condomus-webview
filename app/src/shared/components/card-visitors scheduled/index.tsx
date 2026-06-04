'use client';

import { getVisitorsSchedules } from "../../../domain/home/services";
import { VisitorType } from "./data-visitors-scheduled";
import { visitorIcons } from "../../utils/visitor-icon";
import useSWR from "swr";

export function CardVisitorsScheduled() {

    // visitorsSchedules are provided by useSWR

    const getVisitorIcon = (type: VisitorType) => {
        const IconComponent = visitorIcons[type];
        return <IconComponent size={24} color="#1E40AF" />;
    }

    const {
        data: visitorsSchedules = [],
        isLoading,
        error,
    } = useSWR(
        'visitors-schedules',
        getVisitorsSchedules,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 300000,
        }
    );

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
            <div className="top-0 h-full flex flex-col gap-4 animate-pulse">
                <div className="h-56 bg-gray-300 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-2">Visitantes Agendados</h2>
            <ul>
                {visitorsSchedules.length === 0 && (
                    <li className="text-gray-500">Nenhum visitante agendado</li>
                )}
                {visitorsSchedules.map((schedule) => (
                    <li className="flex items-center justify-between p-4" key={schedule.id}>
                        <div className="flex items-center">
                            <span className="bg-blue-200 p-2 rounded-full">
                                {getVisitorIcon(schedule.type)}
                            </span>
                            <span className="ml-4 font-medium">{schedule.name}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-blue-900 font-bold">{schedule.time}</span>
                            <span className="text-gray-400">{schedule.day}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                className="mt-4 px-4 py-2 border bg-white border-blue-900
                text-blue-900 rounded-4xl font-bold"
            >
                Ver Visitantes Agendados
            </button>
        </div>
    );
}
