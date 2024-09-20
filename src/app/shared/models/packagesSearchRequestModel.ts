export class PackagesSearchRequestModel {
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

    hasFilters(): boolean {
        return !!this.keywords || !!this.issuerName || !!this.achievementType || !!this.effectiveAtYear;
    }
}
