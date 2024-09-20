import { Component, Input, OnInit } from "@angular/core";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControlOptions } from "@angular/forms";
import { AccountService } from "@modules/account/account.service";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { ApiResponse } from "@shared/models/apiResponse";
import { MessageService } from "primeng/api";
import { AccountProfileRequestModel } from "@shared/models/accountProfileRequestModel";
import { AccountProfileResponseModel } from "@shared/models/accountProfileResponseModel";
import { CustomValidators } from "./custom-validators";
import { ProfileService } from "@shared/components/profile/profile.service";
import { faCircle, faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { environment } from "@environment/environment";

@Component({
    selector: "app-account-profile",
    templateUrl: "./accountprofile.component.html",
    styleUrls: ["./accountprofile.component.scss"],
})
export class AccountProfileComponent implements OnInit {
    faPencil = faPencil;
    faCircleUser = faCircleUser;
    editForm: FormGroup;
    profile: AccountProfileResponseModel;
    isEditing: { [key: string]: boolean } = {};
    modelErrors = new Array<string>();
    showSpinner = false;
    newProfileImageFile: File;
    private validProfileImageFileTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/tiff",
    ];
    private maxProfileImageFileSize = 20 * 1024 * 1024; // 20MB

    constructor(
        private _accountService: AccountService,
        private _profileService: ProfileService,
        private _formBuilder: FormBuilder,
        private _messageService: MessageService
    ) {}

    ngOnInit(): void {
        if (environment.debug) console.log("AccountProfileComponent ngOnInit");

        this.editForm = this._formBuilder.group(
            {
                displayName: [null, CustomValidators.maxLengthConditionalValidator(255)],
                phoneNumber: [
                    null,
                    Validators.compose([
                        CustomValidators.phoneValidator(),
                        CustomValidators.minLengthConditionalValidator(10),
                    ]),
                ],
                email: [null, Validators.email],
                profileImageUrl: [null],
                currentPassword: [null],
                newPassword: [
                    null,
                    Validators.compose([
                        // Validators.required,
                        // // check whether the entered password has a number
                        // CustomValidators.patternValidator(/\d/, {
                        //   hasNumber: true
                        // }),
                        // check whether the entered password has upper case letter
                        CustomValidators.patternValidator(/[A-Z]/, {
                            hasCapitalCase: true,
                        }),
                        // check whether the entered password has a lower case letter
                        CustomValidators.patternValidator(/[a-z]/, {
                            hasSmallCase: true,
                        }),
                        // check whether the entered password has a special character
                        CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
                            hasSpecialCharacters: true,
                        }),
                        CustomValidators.minLengthConditionalValidator(6),
                    ]),
                ],
                confirmPassword: [null],
                profileImageFile: [
                    null,
                    Validators.compose([
                        CustomValidators.fileTypeValidator(this.validProfileImageFileTypes),
                        CustomValidators.fileSizeValidator(this.maxProfileImageFileSize),
                    ]),
                ],
            } as AbstractControlOptions,
            {
                // check whether our password and confirm password match
                validator: CustomValidators.passwordMatchValidator,
            } as AbstractControlOptions
        );

        this.resetEditMode();

        this.showSpinner = true;
        this._accountService.getProfile().subscribe(data => {
            if (data.statusCode == 200) {
                this.profile = (<ApiOkResult<AccountProfileResponseModel>>data).result;
                this.editForm.patchValue(this.profile);
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.showSpinner = false;
        });
    }

    handleSubmit() {
        if (environment.debug) console.log("AccountProfileComponent handleSubmit", this.editForm.value);

        if (this.editForm.valid) {
            this.showSpinner = true;
            let accountRequestModel: AccountProfileRequestModel = { ...this.editForm.value };

            return this._accountService.saveProfile(accountRequestModel).subscribe((data: ApiResponse) => {
                if (environment.debug) console.log("AccountProfileComponent handleSubmit", data);
                if (data.statusCode == 200) {
                    const apiOkResponse = <ApiOkResult<AccountProfileResponseModel>>data;
                    this.profile = apiOkResponse.result;
                    this._messageService.add({
                        key: "main",
                        severity: "success",
                        summary: "Success Message",
                        detail: "Profile updated.",
                    });
                    this.editForm.patchValue(this.profile);
                    this.modelErrors = new Array<string>();
                    this.resetEditMode();
                    // signal other profile displays to update
                    this._profileService.refreshProfile();
                } else {
                    this.modelErrors = (<ApiBadRequestResponse>data).errors;
                }
                this.showSpinner = false;
            });
        } else {
            this._messageService.add({
                key: "main",
                severity: "error",
                summary: "Error",
                detail: "Please address the invalid fields and try again.",
            });
        }
    }

    onProfileImageFileSelected(event: any) {
        if (environment.debug) console.log("AccountProfileComponent onProfileImageFileSelected", event);
        const file = event.target.files[0];
        if (file) {
            this.editForm.patchValue({
                profileImageFile: file,
            });
            this.editForm.get("profileImageFile").markAsDirty();
        }
    }

    toggleEdit(field: string | string[]): void {
        if (environment.debug) console.log("AccountProfileComponent toggleEdit", field);

        // handle single field or multiple fields
        // revert change if not editing
        if (typeof field === "string") {
            this.isEditing[field] = !this.isEditing[field];
            if (!this.isEditing[field]) {
                this.editForm.get(field).setValue(this.profile[field]);
            }
        } else {
            field.forEach(f => {
                this.isEditing[f] = !this.isEditing[f];
                if (!this.isEditing[f]) {
                    this.editForm.get(f).setValue(this.profile[f]);
                }
            });
        }
    }
    resetEditMode() {
        if (environment.debug) console.log("AccountProfileComponent resetEditMode");
        this.isEditing = {
            displayName: false,
            phoneNumber: false,
            email: false,
            profileImageUrl: false,
            currentPassword: false,
            newPassword: false,
            confirmPassword: false,
        };
    }

    sendVerificationEmail() {
        if (environment.debug) console.log("AccountProfileComponent sendVerificationEmail");
        // no spinner here
        this._accountService.sendVerificationEmail().subscribe((data: ApiResponse) => {
            if (data.statusCode == 200) {
                let response = <ApiOkResult<string>>data;
                this._messageService.add({
                    key: "main",
                    severity: "success",
                    summary: response.message,
                    detail: "",
                });
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
        });
    }

    hasError(field: string, errorCode: string | null = null): boolean {
        // NOTE: called too frequently for debug
        const formControl = this.editForm.get(field);
        return errorCode != null ? formControl?.hasError(errorCode) : !formControl?.valid;
    }
}
