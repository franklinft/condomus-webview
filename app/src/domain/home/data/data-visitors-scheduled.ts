export type VisitorType =
    | 'visitor'
    | 'service'
    | 'delivery';

export type VisitorAccessStatus =
    | 'pending'
    | 'preauthorized'
    | 'awaiting_confirmation'
    | 'validated'
    | 'revoked'
    | 'expired'
    | 'denied';

export interface VisitorSchedule {
    id: string;
    name: string;
    time: string;
    type: VisitorType;
    day: string;
    apartment?: string;
    block?: string;
    accessStatus?: VisitorAccessStatus;
}
