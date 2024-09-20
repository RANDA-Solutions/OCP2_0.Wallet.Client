import { ListItem } from "./listItem";

export class CredentialCollectionAddEditRequestResponseModel {
    credentialCollectionId: number;
    canDelete: boolean;
    name: string;
    description: string;
    verifiableCredentialItems: ListItem[];
    shareCount: number;
    createdAt: Date;

    constructor() {
        this.credentialCollectionId = 0;
        this.canDelete = false;
        this.name = "";
        this.description = "";
        this.verifiableCredentialItems = new Array<ListItem>();
        this.shareCount = 0;
        this.createdAt = null;
    }
}
