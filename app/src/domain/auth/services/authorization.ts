import { nativeCommunication } from "src/shared/utils/native-communication";
import { Relations } from "src/shared/utils/relations";
import { Result } from "src/shared/utils/types/native-request";
import { AuthorizationResponse } from "../data/auth";

export const authorizeAccount = async (
    token: {
        accessToken: string;
        personId: string;
        accountId: string;
        tenantId: string;
    },
): Promise<AuthorizationResponse> => {
    const response = await nativeCommunication.request<
        Result<AuthorizationResponse>
    >({
        method: "POST",
        rel: Relations.AUTH_AUTHORIZE,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token.accessToken}`,
        },
        body: token,
    });

    if (!response.success || !response.data || !response.data.authorized) {
        throw new Error("Usuário sem uma conta ativa.");
    }

    return response.data;
};
