export class ShareAddRequestModel {
    email: string;
    description: string;
    verifiableCredentialIds: number[];
    credentialCollectionIds: number[];

    constructor() {
        this.email = "";
        this.description = "";
        this.verifiableCredentialIds = new Array<number>();
        this.credentialCollectionIds = new Array<number>();
    }
}
