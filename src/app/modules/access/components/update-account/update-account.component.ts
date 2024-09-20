import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
    AbstractControl,
    AbstractControlOptions,
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators,
} from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { CustomValidators } from "../../custom-validators";
import { SetupService } from "@modules/access/services/setup.service";
import { AccountSetupRequestModel } from "@shared/models/accountSetupRequestModel";
import { AccountSetupStatusChangedEvent } from "@shared/interfaces/accountSetupStatusChanged";
import { VerifyEmailResponseModel } from "@shared/models/verifyEmailResponseModel";
import { AccountSetupStatusEnum } from "@shared/models/enums/accountSetupStatusEnum";
import { MessageService } from "primeng/api";

@UntilDestroy()
@Component({
    selector: "[app-update-account]",
    templateUrl: "./update-account.component.html",
    styleUrls: ["./update-account.component.scss", "../../access-styles.scss"],
    host: {
        class: "h-100",
    },
})
export class UpdateAccountComponent implements OnInit {
    @Output() onStatusChange: EventEmitter<AccountSetupStatusChangedEvent> = new EventEmitter();
    @Input() email: string;
    @Input() accessCode: string;

    public setupForm: FormGroup;
    public modelErrors = new Array<string>();
    public showSpinner = false;
    public sendNewCodeSpinner = false;

    private debug = false;

    constructor(
        private setupService: SetupService,
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.setupForm = this.createSetupForm();
    }

    ngOnInit(): void {
        if (this.debug) console.log(`UpdateAccountComponent ngOnInit`);
    }

    createSetupForm(): FormGroup {
        return this.fb.group(
            {
                displayName: [null, Validators.compose([Validators.maxLength(100), Validators.required])],
                password: [
                    null,
                    Validators.compose([
                        Validators.required,
                        this.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
                        this.patternValidator(/[a-z]/, { hasSmallCase: true }),
                        this.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
                        Validators.minLength(6),
                    ]),
                ],
                confirmPassword: [null, Validators.required],
            } as AbstractControlOptions,
            {
                validator: CustomValidators.passwordMatchValidator,
            } as AbstractControlOptions
        );
    }

    getValidationMessages(control: AbstractControl): string[] {
        if (!control || !control.errors || !control.touched) {
            return [];
        }

        const messages: string[] = [];

        if (control.errors.required) {
            messages.push("This field is required");
        }
        if (control.errors.minlength) {
            messages.push(`Must be at least ${control.errors.minlength.requiredLength} characters`);
        }
        if (control.errors.hasCapitalCase) {
            messages.push("Must contain at least 1 UPPERCASE letter");
        }
        if (control.errors.hasSmallCase) {
            messages.push("Must contain at least 1 lowercase letter");
        }
        if (control.errors.hasSpecialCharacters) {
            messages.push("Must contain at least 1 symbol");
        }

        if (control.errors.NoPassswordMatch) {
            messages.push("Passwords must match");
        }

        return messages;
    }

    patternValidator(regex: RegExp, error: { [key: string]: boolean }): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (!control.value) {
                return null;
            }
            const valid = regex.test(control.value);
            return valid ? null : error;
        };
    }

    hasError(field: string, errorCode: string | null = null): boolean {
        // NOTE: called too frequently for debug
        const formControl = this.setupForm.get(field);

        if (!formControl || !formControl.errors || !formControl.touched) {
            return false;
        }

        return errorCode != null ? formControl?.hasError(errorCode) : !formControl?.valid;
    }

    handleSubmit() {
        if (this.debug) console.log(`UpdateAccountComponent handleSubmit`);

        if (this.setupForm.valid) {
            this.showSpinner = true;

            const accountSetupRequestModel: AccountSetupRequestModel = {
                email: this.email,
                accessCode: this.accessCode,
                displayName: this.setupForm["controls"].displayName.value,
                password: this.setupForm["controls"].password.value,
                confirmPassword: this.setupForm["controls"].confirmPassword.value,
            };

            this.setupService.setup(accountSetupRequestModel).subscribe(data => {
                if (this.debug) console.log(`UpdateAccountComponent handleSubmit data`, data);

                if (data.statusCode == 200) {
                    const model = (<ApiOkResult<VerifyEmailResponseModel>>data).result;
                    this.onStatusChange.emit({ status: model.status, accessCode: this.accessCode });

                    if (model.status == AccountSetupStatusEnum.AccountComplete) {
                        this.messageService.add({
                            key: "main",
                            severity: "success",
                            summary: "Success Message",
                            detail: `Account setup complete!`,
                        });
                    }
                } else if (data.statusCode == 410) {
                    // code expired so start them over
                    window.location.reload();
                } else if (data.statusCode == 404) {
                    // code not found matching this email
                    this.onStatusChange.emit({ status: AccountSetupStatusEnum.AccountNotFound, accessCode: "" });
                } else {
                    this.modelErrors = (<ApiBadRequestResponse>data).errors;
                }
                this.showSpinner = false;
            });
        }
    }
}
