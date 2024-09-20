import { CredentialCardAlignmentResponseViewModel } from "./credentialCardAlignmentResponseViewModel";
import { CredentialCardResultResponseModel } from "./credentialCardResultResponseModel";

export class CredentialCardResponseViewModel {
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
    isRevoked: boolean;
    revokedReason: string;
    alignments: CredentialCardAlignmentResponseViewModel[];
    results: CredentialCardResultResponseModel[];
    hasEvidence: boolean;

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
        this.isRevoked = false;
        this.revokedReason = null;
        this.alignments = new Array<CredentialCardAlignmentResponseViewModel>();
        this.results = new Array<CredentialCardResultResponseModel>();
        this.hasEvidence = false;
    }
}
