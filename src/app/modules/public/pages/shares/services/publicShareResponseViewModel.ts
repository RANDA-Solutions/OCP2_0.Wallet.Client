export class PublicShareResponseViewModel {
    sharedId: number;
    hash: string;
    displayName: string;

    constructor(){
        this.sharedId = 0;
        this.hash = "";
        this.displayName = "";
    }
}
