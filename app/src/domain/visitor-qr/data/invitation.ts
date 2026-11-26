export type InvitationStatus =
    | "pending"
    | "awaiting_confirmation"
    | "validated"
    | "expired"
    | "revoked"
    | "denied";

export type InvitationAuthorizationMode = "arrival" | "preauthorized";

export type VisitorInvitation = {
    id: string;
    visitorName: string;
    visitorType: string;
    additionalInfo: string;
    authorizationMode: InvitationAuthorizationMode;
    apartment?: string;
    block?: string;
    createdAt: string;
    expiresAt: string;
    status: InvitationStatus;
    qrCodeToken: string;
    publicUrl: string;
};

export type CreateVisitorInvitationData = {
    visitorName: string;
    visitorType: string;
    additionalInfo: string;
    authorizationMode: InvitationAuthorizationMode;
};

export type RevokeVisitorInvitationData = {
    invitationId: string;
};

export type ValidateVisitorInvitationData = {
    token: string;
    validationId: string;
    validatedAt: string;
};

export type ValidateVisitorInvitationResponse = {
    valid: boolean;
    message: string;
    invitation: VisitorInvitation | null;
    synchronized: boolean;
    residentWhatsappUrl?: string;
    requiresResidentConfirmation?: boolean;
};

export type AuthorizeVisitorInvitationData = {
    invitationId: string;
    authorized: boolean;
};

export type PublicVisitorInvitation = Pick<
    VisitorInvitation,
    "visitorName" | "visitorType" | "expiresAt" | "status"
>;

export type OfflineValidationData =
    ValidateVisitorInvitationData & {
        result: "validated" | "denied";
    };

export type SyncOfflineValidationsData = {
    validations: OfflineValidationData[];
};

export type SyncOfflineValidationsResponse = {
    synchronizedIds: string[];
    rejectedIds: string[];
};
