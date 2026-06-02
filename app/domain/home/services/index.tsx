import { nativeCommunication } from "@/shared/utils/native-communication";
import { Relations } from "@/shared/utils/relations";

export interface VisitorSchedule {
    id: string;
    visitorName: string;
    date: string;
}

export const getVisitorsSchedules =
    async (): Promise<VisitorSchedule[]> => {
        return nativeCommunication.request({
            method: 'GET',
            rel: Relations.GET_VISITORS_SCHEDULES,
        });
    };

export const getVisitorsCount =
    async (): Promise<number> => {
        return nativeCommunication.request({
            method: 'GET',
            rel: Relations.GET_VISITORS_COUNT,
        });
    };
