export const Relations = {
    GET_VISITORS_SCHEDULES: 'visitors-schedules',
    GET_VISITORS_COUNT: 'visitors-count',
} as const;

export type Relation =
    (typeof Relations)[keyof typeof Relations];
