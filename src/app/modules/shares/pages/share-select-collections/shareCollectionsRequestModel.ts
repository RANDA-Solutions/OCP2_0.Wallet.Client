import { ListItem } from "@shared/models/listItem";

export class ShareCollectionsRequestModel {
    credentialCollectionItems: ListItem[];

    constructor() {
        this.credentialCollectionItems = new Array<ListItem>();
    }
}
