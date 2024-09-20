export class PackageDetailsResponseModel {
    credentialPackageId: number;
    canDelete: boolean;
    name: string;
    description: string;
    createdAt: Date;
    shareCount: number;
    verifiableCredentialIds: number[];
    isVerified: boolean;
    isRevoked: boolean;
    revokedReason: string;
    verifiableCredentialId: number;

    constructor() {
        this.credentialPackageId = 0;
        this.canDelete = false;
        this.name = null;
        this.description = null;
        this.createdAt = null;
        this.shareCount = 0;
        this.verifiableCredentialIds = new Array<number>();
        this.isVerified = false;
        this.revokedReason = null;
        this.verifiableCredentialId = 0;
    }
}
