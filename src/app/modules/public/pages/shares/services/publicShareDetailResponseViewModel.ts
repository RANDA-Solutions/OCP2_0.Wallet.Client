export class PublicShareDetailResponseViewModel {
    shareId: number;
    hash: string;
    code: string;
    displayName: string;
    verifiableCredentialIds: Array<number>;

    constructor(){
        this.shareId = 0;
        this.hash = "";
        this.code = "";
        this.displayName = "";
        this.verifiableCredentialIds = new Array<number>();
    }
}