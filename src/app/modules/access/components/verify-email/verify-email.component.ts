import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SetupService } from "@modules/access/services/setup.service";
import { AccountSetupStatusChangedEvent } from "@shared/interfaces/accountSetupStatusChanged";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { VerifyEmailResponseModel } from "@shared/models/verifyEmailResponseModel";
import { ChangeDetectorRef } from "@angular/core";
import { VerifyAccessCodeRequestModel } from "@shared/models/verifyAccessCodeRequestModel";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";

@Component({
    selector: "[app-verify-email]",
    templateUrl: "./verify-email.component.html",
    styleUrls: ["./verify-email.component.scss"],
})
export class VerifyEmailComponent implements OnInit {
    @Output() onStatusChange: EventEmitter<AccountSetupStatusChangedEvent> = new EventEmitter();
    @Input() email: string;

    submitForm: FormGroup;
    showSpinner = false;
    sendNewCodeSpinner = false;
    modelErrors = new Array<string>();
    private debug: boolean = true;

    constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private setupService: SetupService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // define form
        this.submitForm = this.formBuilder.group({
            accessCode: [null, null],
        } as AbstractControlOptions);
    }

    handleSubmit() {
        if (this.debug) console.log("VerifyEmailComponent handleSubmit", this.submitForm.value);

        if (this.submitForm.valid) {
            this.showSpinner = true;
            const request: VerifyAccessCodeRequestModel = {
                email: this.email,
                accessCode: this.submitForm.value.accessCode,
            };
            return this.setupService.verifyEmail(request).subscribe(data => {
                if (this.debug) console.log("VerifyEmailComponent handleSubmit", data);

                if (data.statusCode == 200) {
                    const model: VerifyEmailResponseModel = (<ApiOkResult<VerifyEmailResponseModel>>data).result;
                    this.onStatusChange.emit({ status: model.status, accessCode: request.accessCode });
                } else if (data.statusCode == 404) {
                    this.submitForm.controls["accessCode"].setErrors({
                        custom: "Code and email combination invalid.",
                    });
                } else {
                    this.submitForm.controls["accessCode"].setErrors({
                        custom: "Code invalid. Please enter the 6-digit code provided in the email.",
                    });
                }
                this.showSpinner = false;
            });
        } else {
            this.submitForm.markAllAsTouched();
        }
    }

    hasError(field: string, errorCode: string | null = null): boolean {
        // NOTE: called too frequently for debug
        const formControl = this.submitForm.get(field);

        if (!formControl || !formControl.errors || !formControl.touched) {
            return false;
        }

        return errorCode != null ? formControl?.hasError(errorCode) : !formControl?.valid;
    }

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
