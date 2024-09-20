export class CredentialCollectionsSearchRequestModel {
    sortBy: string | null;
    keywords: string | null;

    constructor() {
        this.keywords = "";
        this.sortBy = "name";
    }
}
