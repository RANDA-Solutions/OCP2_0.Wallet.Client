export class VerifyAccessCodeRequestModel {
    accessCode: string;
    email: string;

    constructor() {
        this.email = "";
        this.accessCode = "";
    }
}
