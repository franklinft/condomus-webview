import { nativeCommunication } from "src/shared/utils/native-communication";
import { Relations } from "src/shared/utils/relations";
import { Result } from "src/shared/utils/types/native-request";
import {
    PackageRecord,
    ReceivePackageData,
} from "../data/package";

const requestHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

export const getPackages = async (): Promise<PackageRecord[]> => {
    const response = await nativeCommunication.request<
        Result<PackageRecord[]>
    >({
        method: "GET",
        rel: Relations.GET_PACKAGES,
        headers: requestHeaders,
    });

    return response.data;
};

export const createPackage = async (
    data: ReceivePackageData,
): Promise<PackageRecord> => {
    const response = await nativeCommunication.request<
        Result<PackageRecord>
    >({
        method: "POST",
        rel: Relations.CREATE_PACKAGE,
        headers: requestHeaders,
        body: data,
    });

    return response.data;
};
