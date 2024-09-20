export class PackageSearchResponseModel {
    credentialPackageId: number;
    verifiableCredentialId: number
    canDelete: boolean;
    name: string;
    issuerName: string;
    effectiveImageUrl: string;
    achievementCount: number;
    shareCount: number;
    effectiveAt: Date;
    expiresAt: Date | null;
    createdAt: Date;
    isVerified: boolean;
    isRevoked: boolean;
    revokedReason: string;


    constructor() {
        this.credentialPackageId = 0;
        this.verifiableCredentialId = 0;
        this.canDelete = false;
        this.name = null;
        this.issuerName = null;
        this.effectiveImageUrl = null;
        this.achievementCount = 0;
        this.shareCount = 0;
        this.effectiveAt = null;
        this.expiresAt = null;
        this.createdAt = null;
        this.isVerified = false;
        this.isRevoked = false;
        this.revokedReason = null;
    
    }
}
