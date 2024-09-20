import { AccountSetupStatusEnum } from "./enums/accountSetupStatusEnum";

export class VerifyEmailResponseModel {
    email: string | null;
    status: AccountSetupStatusEnum;

    constructor() {
        this.email = null;
        this.status = AccountSetupStatusEnum.AccountNotFound;
    }
}
