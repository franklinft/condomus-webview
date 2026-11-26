import {
    CreateVisitorInvitationData,
    AuthorizeVisitorInvitationData,
    RevokeVisitorInvitationData,
    SyncOfflineValidationsData,
    SyncOfflineValidationsResponse,
    ValidateVisitorInvitationData,
    ValidateVisitorInvitationResponse,
    PublicVisitorInvitation,
    VisitorInvitation,
} from "../data/invitation";
import { nativeCommunication } from "../../../shared/utils/native-communication";
import { Relations } from "../../../shared/utils/relations";
import { Result } from "../../../shared/utils/types/native-request";

const requestHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

export const createVisitorInvitation = async (
    data: CreateVisitorInvitationData,
): Promise<VisitorInvitation> => {
    const response = await nativeCommunication.request<
        Result<VisitorInvitation>
    >({
        method: "POST",
        rel: Relations.CREATE_VISITOR_INVITATION,
        headers: requestHeaders,
        body: data,
    });

    return response.data;
};

export const revokeVisitorInvitation = async (
    data: RevokeVisitorInvitationData,
): Promise<VisitorInvitation> => {
    const response = await nativeCommunication.request<
        Result<VisitorInvitation>
    >({
        method: "POST",
        rel: Relations.REVOKE_VISITOR_INVITATION,
        headers: requestHeaders,
        body: data,
    });

    return response.data;
};

export const validateVisitorInvitation = async (
    data: ValidateVisitorInvitationData,
): Promise<ValidateVisitorInvitationResponse> => {
    const response = await nativeCommunication.request<
        Result<ValidateVisitorInvitationResponse>
    >({
        method: "POST",
        rel: Relations.VALIDATE_VISITOR_INVITATION,
        headers: requestHeaders,
        body: data,
    });

    return response.data;
};

export const authorizeVisitorInvitation = async (
    data: AuthorizeVisitorInvitationData,
): Promise<VisitorInvitation> => {
    const response = await nativeCommunication.request<
        Result<VisitorInvitation>
    >({
        method: "POST",
        rel: Relations.AUTHORIZE_VISITOR_INVITATION,
        headers: requestHeaders,
        body: data,
    });

    return response.data;
};

export const getPendingAuthorizations = async (): Promise<
    VisitorInvitation[]
> => {
    const response = await nativeCommunication.request<
        Result<VisitorInvitation[]>
    >({
        method: "GET",
        rel: Relations.GET_PENDING_AUTHORIZATIONS,
        headers: requestHeaders,
    });

    return response.data;
};

export const getPublicVisitorInvitation = async (
    token: string,
): Promise<PublicVisitorInvitation> => {
    const response = await nativeCommunication.request<
        Result<PublicVisitorInvitation>
    >({
        method: "GET",
        rel: Relations.GET_PUBLIC_VISITOR_INVITATION,
        headers: requestHeaders,
        body: { token },
    });

    if (!response.data) {
        throw new Error("Convite não encontrado.");
    }

    return response.data;
};

export const syncOfflineValidations = async (
    data: SyncOfflineValidationsData,
): Promise<SyncOfflineValidationsResponse> => {
    const response = await nativeCommunication.request<
        Result<SyncOfflineValidationsResponse>
    >({
        method: "POST",
        rel: Relations.SYNC_OFFLINE_VALIDATIONS,
        headers: requestHeaders,
        body: data,
    });

    return response.data;
};
