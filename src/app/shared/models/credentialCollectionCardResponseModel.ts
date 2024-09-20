export class CredentialCollectionCardResponseModel {
    credentialCollectionId: number;
    canDelete: boolean;
    name: string;
    description: string;
    shareCount: number;
    createdAt: Date;

    constructor() {
        this.credentialCollectionId = 0;
        this.canDelete = false;
        this.name = null;
        this.description = null;
        this.shareCount = 0;
        this.createdAt = null;
    }
}
