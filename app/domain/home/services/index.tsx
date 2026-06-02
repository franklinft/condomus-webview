import { nativeCommunication } from "@/shared/utils/native-communication";
import { Relations } from "@/shared/utils/relations";
import { Result } from "@/shared/utils/types/native-request";

export interface VisitorSchedule {
    id: string;
    visitorName: string;
    date: string;
}

export const getVisitorsSchedules =
    async (): Promise<Result<VisitorSchedule[]>> => {
        return nativeCommunication.request({
            method: 'GET',
            rel: Relations.GET_VISITORS_SCHEDULES
        });
    };

export const getVisitorsCount = async (): Promise<number> => {
    const response = await nativeCommunication.request<number>({
        method: 'GET',
        rel: Relations.GET_VISITORS_COUNT,
    });

    return response;
};
