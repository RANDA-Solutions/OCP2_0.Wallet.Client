export class CredentialSearchRequestModel {
    keywords: string | null;
    issuerName: string | null;
    achievementType: string | null;
    effectiveAtYear: number | null;

    constructor() {
        this.keywords = "";
        this.issuerName = "";
        this.achievementType = "";
        this.effectiveAtYear = null;
    }
}
