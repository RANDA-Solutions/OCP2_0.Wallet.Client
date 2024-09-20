export class RevocationResponseModel {
    isRevoked: boolean;
    revokedReason: string;

    constructor() {
        this.isRevoked = false;
        this.revokedReason = "";
    }
}
