export class ShareListResponseModel {
    shareId: number;
    email: string;
    description: string;
    credentialCount: number;
    createdAt: Date;

    constructor() {
        this.shareId = 0;
        this.email = null;
        this.description = null;
        this.credentialCount = 0;
        this.createdAt = null;
    }
}
