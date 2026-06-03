'use client';

import { getVisitorsSchedules } from "../../../domain/home/services";
import { useEffect, useState } from "react";
import { VisitorSchedule, VisitorType } from "./data-visitors-scheduled";
import { visitorIcons } from "../../utils/visitor-icon";
import { useRouter } from "next/navigation";

export function CardVisitorsScheduled() {
    const router = useRouter();

    const [visitorsSchedules, setVisitorsSchedules] =
        useState<VisitorSchedule[]>([]);

    const getVisitorIcon = (type: VisitorType) => {
        const IconComponent = visitorIcons[type];
        return <IconComponent size={24} color="#1E40AF" />;
    }

    useEffect(() => {
        getVisitorsSchedules()
            .then((result) => {
                setVisitorsSchedules(result);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    function getCreateNewInvitation() {
        router.push('/new-invitation');
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
                onClick={getCreateNewInvitation}>
                Ver Visitantes Agendados
            </button>
        </div>
    );
}
