import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { SetupService } from "@modules/access/services/setup.service";
import { AccountSetupStatusChangedEvent } from "@shared/interfaces/accountSetupStatusChanged";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { VerifyEmailResponseModel } from "@shared/models/verifyEmailResponseModel";
import { MessageService } from "primeng/api";

@Component({
    selector: "[app-code-expired]",
    templateUrl: "./code-expired.component.html",
    styleUrls: ["./code-expired.component.scss"],
})
export class CodeExpiredComponent {
    @Output() onStatusChange: EventEmitter<AccountSetupStatusChangedEvent> = new EventEmitter();
    @Input() email: string;

    sendNewCodeSpinner = false;
    codeExpired = false;
    modelErrors = new Array<string>();
    private debug: boolean = true;

    constructor(
        private messageService: MessageService,
        private setupService: SetupService,
        private router: Router
    ) {}

    requestNewCode() {
        if (this.debug) console.log("SetupAccountComponent.requestNewCode");

        this.sendNewCodeSpinner = true;
        this.setupService.getAccountStatus(this.email).subscribe(data => {
            if (this.debug) console.log("SetupAccountComponent.requestNewCode data", data);

            if (data.statusCode == 200) {
                const model = (<ApiOkResult<VerifyEmailResponseModel>>data).result;
                this.onStatusChange.emit({ status: model.status, accessCode: null });
                this.messageService.add({
                    key: "main",
                    severity: "success",
                    summary: "Success Message",
                    detail: `A new access code was emailed to ${this.email}.`,
                });
                this.router.navigate(["/access/setup"], {
                    queryParams: { email: this.email },
                    replaceUrl: true,
                });
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.sendNewCodeSpinner = false;
        });
    }
}
