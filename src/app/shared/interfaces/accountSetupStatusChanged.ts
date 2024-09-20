import { AccountSetupStatusEnum } from "@shared/models/enums/accountSetupStatusEnum";

export interface AccountSetupStatusChangedEvent {
    status: AccountSetupStatusEnum;
    accessCode: string | null;
}
