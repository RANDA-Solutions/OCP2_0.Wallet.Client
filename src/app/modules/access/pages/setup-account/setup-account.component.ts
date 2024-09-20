import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { SetupService } from "@modules/access/services/setup.service";
import { AccountSetupStatusEnum } from "@shared/models/enums/accountSetupStatusEnum";
import { VerifyEmailResponseModel } from "@shared/models/verifyEmailResponseModel";
import { AccountSetupStatusChangedEvent } from "@shared/interfaces/accountSetupStatusChanged";
import { environment } from "@environment/environment";
import posthog from "posthog-js";

@UntilDestroy()
@Component({
    selector: "app-setup-account",
    templateUrl: "./setup-account.component.html",
    styleUrls: ["./setup-account.component.scss", "../../access-styles.scss"],
    host: {
        class: "h-100",
    },
})
export class SetupAccountComponent implements OnInit {
    errorMessage: string;
    showSpinner: boolean = false;

    email: string | null;
    accessCode: string | null;
    status: AccountSetupStatusEnum | null;
    AccountSetupStatusEnum = AccountSetupStatusEnum;

    constructor(
        private setupService: SetupService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (environment.debug) console.log("SetupAccountComponent.ngOnInit");

        this.activatedRoute.queryParamMap.subscribe(params => {
            if (environment.debug) console.log("SetupAccountComponent.ngOnInit params", params);
            this.email = params.get("email");

            // posthog identify user for troubleshooting
            if (!!environment.posthogApiKey && !!this.email) {
                posthog.identify(
                    this.email.toLocaleUpperCase(),
                    { email: this.email.toLocaleUpperCase() } // optional: set person properties
                );
            }

            this.checkEmail();
        });
    }

    checkEmail() {
        this.showSpinner = true;
        this.errorMessage = null;
        this.setupService.getAccountStatus(this.email).subscribe(data => {
            if (environment.debug) console.log("SetupAccountComponent.ngOnInit data", data);

            if (data.statusCode == 200) {
                const model = (<ApiOkResult<VerifyEmailResponseModel>>data).result;
                this.handleStatusChange({ status: model.status, accessCode: null });
            } else {
                this.errorMessage =
                    "An unexpected error occurred retrieving your account information. Please check your network connection and try again.";
                console.error("SetupAccountComponent.checkEmail", data);
            }
            this.showSpinner = false;
        });
    }

    handleStatusChange(event: AccountSetupStatusChangedEvent) {
        if (environment.debug) console.log("SetupAccountComponent.handleStatusChange", event);

        this.status = event.status;
        this.accessCode = event.accessCode;

        if (this.status == AccountSetupStatusEnum.AccountComplete) {
            this.router.navigate(["/access/login"], {
                queryParams: { email: this.email },
                state: {
                    infoMessage:
                        "Congratulations! Your account is ready to go. Please login below to view your profile.",
                },
            });
        }
    }
}
