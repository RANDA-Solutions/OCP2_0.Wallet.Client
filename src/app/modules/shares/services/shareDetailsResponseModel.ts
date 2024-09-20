export class ShareDetailsResponseModel {
    shareId: number;
    email: string;
    description: string;
    credentialCount: number;
    createdAt: Date;

    verifiableCredentialIds: number[];
    credentialCollectionIds: number[];

    constructor() {
        this.shareId = 0;
        this.email = null;
        this.description = null;
        this.credentialCount = 0;
        this.createdAt = null;
        this.verifiableCredentialIds = Array<number>();
        this.credentialCollectionIds = Array<number>();
    }
}
