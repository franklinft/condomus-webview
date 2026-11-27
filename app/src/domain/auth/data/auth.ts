export type AccountStatus = "active" | "inactive";

export type LoginCredentials = {
    email: string;
    password: string;
};

export type AuthTokenResponse = {
    accessToken: string;
    tokenType: "Bearer";
    expiresIn: number;
    expiresAt: string;
    personId: string;
    accountId: string;
    tenantId: string;
};

export type UserProfile = {
    personId: string;
    accountId: number;
    tenantId: string;
    email: string;
    name: string;
    role: string;
    accountStatus: string;
    active: boolean;
};

export type AuthorizationResponse = {
    authorized: boolean;
    accessToken: string;
    personId: string;
    accountId: string;
    tenantId: string;
    accountStatus: AccountStatus;
    displayName: string;
};

export type AuthSession = AuthorizationResponse & {
    expiresAt: string;
};
