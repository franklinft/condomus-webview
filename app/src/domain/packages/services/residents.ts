import { nativeCommunication } from "src/shared/utils/native-communication";
import { Relations } from "src/shared/utils/relations";
import { Result } from "src/shared/utils/types/native-request";
import { ResidentRecord } from "../data/residents";

export const getResidents = async (): Promise<ResidentRecord[]> => {
    const response = await nativeCommunication.request<
        Result<ResidentRecord[]>
    >({
        method: "GET",
        rel: Relations.GET_RESIDENTS,
        headers: {
            Accept: "application/json",
        },
    });

    return response.data;
};
