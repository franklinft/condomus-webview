export const Relations = {
    GET_VISITORS_SCHEDULES: 'get-visitors-schedules',
    GET_VISITORS_COUNT: 'get-visitors-count',
} as const;

export type Relation =
    (typeof Relations)[keyof typeof Relations];
