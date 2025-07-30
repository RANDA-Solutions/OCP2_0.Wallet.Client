import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "@environment/environment";
import { SetupService } from "@modules/access/services/setup.service";
import { UntilDestroy } from "@ngneat/until-destroy";
import { AccountSetupStatusChangedEvent } from "@shared/interfaces/accountSetupStatusChanged";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { AccountSetupStatusEnum } from "@shared/models/enums/accountSetupStatusEnum";
import { VerifyEmailResponseModel } from "@shared/models/verifyEmailResponseModel";
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
    viewState: 'loading' | 'results'; 


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
        this.viewState = 'loading'; // Show the spinner
        this.errorMessage = null;
        this.setupService.getAccountStatus(this.email).subscribe(data => {
            if (environment.debug) console.log("SetupAccountComponent.ngOnInit data", data);

            if (data.statusCode == 200) {
                const model = (<ApiOkResult<VerifyEmailResponseModel>>data).result;
                this.handleStatusChange({ status: model.status, accessCode: null });
                this.viewState = 'results'; // Switch to results view
            } else {
                this.errorMessage =
                    "An unexpected error occurred retrieving your account information. Please check your network connection and try again.";
                console.error("SetupAccountComponent.checkEmail", data);
                this.viewState = 'results'; // Show the spinner
            }
        });
    }

    requestVerification() {
        this.viewState = 'loading'; // Show the spinner
        this.errorMessage = null;
        this.setupService.requestAccountVerification(this.email).subscribe(data => {
            if (environment.debug) console.log("SetupAccountComponent.requestVerification data", data);

            if (data.statusCode == 200) {
                const model = (<ApiOkResult<VerifyEmailResponseModel>>data).result;
                this.handleStatusChange({ status: model.status, accessCode: null });
                this.viewState = 'results'; // Switch to results view
            } else {
                this.errorMessage =
                    "An unexpected error occurred retrieving your account information. Please check your network connection and try again.";
                console.error("SetupAccountComponent.checkEmail", data);
                this.viewState = 'results'; // Show the spinner
            }
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
                    infoMessage: "Please login to your wallet.",
                },
            });
        }
    }
}
