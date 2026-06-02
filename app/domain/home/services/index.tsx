import { nativeCommunication } from "@/shared/utils/native-communication";
import { Relations } from "@/shared/utils/relations";

export interface VisitorSchedule {
    id: string;
    visitorName: string;
    date: string;
}

export interface VisitorSchedulesResponse {
    data: VisitorSchedule[];
    success: boolean;
}

export const getVisitorsSchedules = async (): Promise<VisitorSchedule[]> => {
    const response = await nativeCommunication.request<VisitorSchedulesResponse>({
        method: 'GET',
        rel: Relations.GET_VISITORS_SCHEDULES,
    });

    console.log('Get Visitors Schedules Response:', response);
    return response.data;
};

export const getVisitorsCount = async (): Promise<number> => {
    const response = await nativeCommunication.request<number>({
        method: 'GET',
        rel: Relations.GET_VISITORS_COUNT,
    });

    return response;
};
