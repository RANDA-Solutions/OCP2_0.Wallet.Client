import { CredentialCardAlignmentResponseModel } from "./credentialCardAlignmentResponseModel";
import { CredentialCardResultResponseModel } from "./credentialCardResultResponseModel";

export class CredentialCardResponseModel {
    verifiableCredentialId: number;
    name: string;
    description: string;
    humanCode: string;
    issuerName: string;
    effectiveImageUrl: string;
    achievementType: string;
    achievementIdUrl: string;
    createdAt: Date;
    shareCount: number;
    recipientName: string;
    licenseNumber: string;
    canDelete: boolean;
    effectiveAt: Date;
    expiresAt: Date | null;
    isVerified: boolean;
    alignments: CredentialCardAlignmentResponseModel[];
    results: CredentialCardResultResponseModel[];
    hasEvidence: boolean;
    isRevoked: boolean;
    revokedReason: string;

    constructor() {
        this.verifiableCredentialId = 0;
        this.name = null;
        this.description = null;
        this.humanCode = null;
        this.issuerName = null;
        this.effectiveImageUrl = null;
        this.achievementType = null;
        this.achievementIdUrl = null;
        this.createdAt = null;
        this.shareCount = 0;
        this.recipientName = null;
        this.licenseNumber = null;
        this.canDelete = false;
        this.effectiveAt = null;
        this.expiresAt = null;
        this.isVerified = null;
        this.alignments = new Array<CredentialCardAlignmentResponseModel>();
        this.results = new Array<CredentialCardResultResponseModel>();
        this.hasEvidence = false;
        this.isRevoked = false;
        this.revokedReason = null;
    }
}
