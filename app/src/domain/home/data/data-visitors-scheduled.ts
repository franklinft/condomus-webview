export type VisitorType =
    | 'visitor'
    | 'service'
    | 'delivery';

export interface VisitorSchedule {
    id: string;
    name: string;
    time: string;
    type: VisitorType;
    day: string;
    apartment?: string;
    block?: string;
}
