import { AuthTokenResponse, LoginCredentials, UserProfile } from "../data/auth";

type BackendTokenResponse = {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    personId: string;
    accountId: number;
    tenantId: string;
};

export const authenticate = async (
    credentials: LoginCredentials,
): Promise<AuthTokenResponse> => {
    const response = await fetch("http://localhost:8080/v1/auth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            correlationId: crypto.randomUUID(),
            flowId: crypto.randomUUID(),
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error("Credenciais inválidas.");
    }

    const data = (await response.json()) as BackendTokenResponse;

    return {
        accessToken: data.accessToken,
        tokenType: "Bearer",
        expiresIn: data.expiresIn,
        expiresAt: new Date(Date.now() + data.expiresIn * 1000).toISOString(),
        personId: data.personId,
        accountId: String(data.accountId),
        tenantId: data.tenantId,
    };
};

export const getUserProfile = async (
    token: AuthTokenResponse,
): Promise<UserProfile> => {
    const response = await fetch(
        `http://localhost:8080/v1/tenants/${token.tenantId}/users/${token.personId}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token.accessToken}`,
                correlationId: crypto.randomUUID(),
                flowId: crypto.randomUUID(),
            },
        },
    );

    if (!response.ok) {
        throw new Error("Não foi possível carregar os dados cadastrais.");
    }

    return (await response.json()) as UserProfile;
};
