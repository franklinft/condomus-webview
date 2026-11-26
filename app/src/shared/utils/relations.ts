export const Relations = {
    GET_VISITORS_SCHEDULES: '/v1/accounts',
    GET_VISITORS_COUNT: '/visitors-count',
    CREATE_VISITOR_INVITATION: '/v1/visitor-invitations',
    REVOKE_VISITOR_INVITATION: '/v1/visitor-invitations/revoke',
    VALIDATE_VISITOR_INVITATION: '/v1/visitor-invitations/validate',
    SYNC_OFFLINE_VALIDATIONS: '/v1/visitor-invitations/sync',
    GET_PUBLIC_VISITOR_INVITATION: '/v1/visitor-invitations/public',
} as const;

export type Relation =
    (typeof Relations)[keyof typeof Relations];
