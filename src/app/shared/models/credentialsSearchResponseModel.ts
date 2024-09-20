export class CredentialsSearchResponseModel {
    verifiableCredentialIds: number[];
    issuerNames: string[];
    achievementTypes: string[];
    effectiveAtYears: number[];
    constructor() {
        this.verifiableCredentialIds = new Array<number>();
        this.issuerNames = new Array<string>();
        this.achievementTypes = new Array<string>();
        this.effectiveAtYears = new Array<number>();
    }
}
