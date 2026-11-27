export type PackageStatus = "received" | "notified" | "collected";

export type PackageRecord = {
    id: string;
    residentId?: string;
    recipientName: string;
    apartment: string;
    address?: string;
    carrier: string;
    trackingCode: string;
    status: PackageStatus;
    receivedAt: string;
    photoUrl?: string;
};

export type ReceivePackageData = {
    residentId?: string;
    recipientName: string;
    apartment: string;
    address?: string;
    carrier: string;
    trackingCode: string;
    photoUrl?: string;
};
