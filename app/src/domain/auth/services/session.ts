import { AuthSession } from "../data/auth";

const authSessionStorageKey = "condomus-auth-session";

export const saveAuthSession = (session: AuthSession) => {
    globalThis.localStorage?.setItem(
        authSessionStorageKey,
        JSON.stringify(session),
    );
};

export const clearAuthSession = () => {
    globalThis.localStorage?.removeItem(authSessionStorageKey);
};

export const getAuthSession = (): AuthSession | null => {
    const storedSession = globalThis.localStorage?.getItem(
        authSessionStorageKey,
    );

    if (!storedSession) {
        return null;
    }

    try {
        return JSON.parse(storedSession) as AuthSession;
    } catch {
        globalThis.localStorage?.removeItem(authSessionStorageKey);
        return null;
    }
};
