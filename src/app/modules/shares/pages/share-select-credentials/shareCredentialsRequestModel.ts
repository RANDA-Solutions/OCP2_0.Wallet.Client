import { ListItem } from "@shared/models/listItem";

export class ShareCredentialsRequestModel {
    verifiableCredentialItems: ListItem[];

    constructor() {
        this.verifiableCredentialItems = new Array<ListItem>();
    }
}
