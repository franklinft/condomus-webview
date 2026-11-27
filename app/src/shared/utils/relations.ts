export const Relations = {
    GET_VISITORS_SCHEDULES: '/v1/accounts',
    GET_VISITORS_COUNT: '/visitors-count',
    CREATE_VISITOR_INVITATION: '/v1/visitor-invitations',
    REVOKE_VISITOR_INVITATION: '/v1/visitor-invitations/revoke',
    VALIDATE_VISITOR_INVITATION: '/v1/visitor-invitations/validate',
    SYNC_OFFLINE_VALIDATIONS: '/v1/visitor-invitations/sync',
    GET_PUBLIC_VISITOR_INVITATION: '/v1/visitor-invitations/public',
    AUTHORIZE_VISITOR_INVITATION: '/v1/visitor-invitations/authorize',
    GET_PENDING_AUTHORIZATIONS: '/v1/visitor-invitations/pending-authorizations',
    GET_PACKAGES: '/v1/packages',
    GET_RESIDENTS: '/v1/residents',
    CREATE_PACKAGE: '/v1/packages',
    AUTH_LOGIN: '/v1/auth/login',
    AUTH_AUTHORIZE: '/v1/auth/authorize',
} as const;

export type Relation =
    (typeof Relations)[keyof typeof Relations];
