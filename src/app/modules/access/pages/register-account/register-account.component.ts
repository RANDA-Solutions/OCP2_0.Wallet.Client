import { Component, OnInit } from "@angular/core";
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { AccountService } from "@modules/account/account.service";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { RegisterAccountVM } from "@shared/models/registerAccountVM";
import { take } from "rxjs/operators";
import { CustomValidators } from "../../custom-validators";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";

@UntilDestroy()
@Component({
    selector: "app-register-account",
    templateUrl: "./register-account.component.html",
    styleUrls: ["./register-account.component.scss", "../../access-styles.scss"],
    host: {
        class: "h-100",
    },
})
export class RegisterAccountComponent implements OnInit {
    faCheckCircle = faCheckCircle;
    faBan = faBan;
    public frmRegister: FormGroup;
    modelErrors = new Array<string>();
    input: RegisterAccountVM = new RegisterAccountVM();
    showSpinner = false;
    buttonSpinner = false;
    private returnUrl: string | null;
    private debug = false;
    constructor(
        private accountService: AccountService,
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.frmRegister = this.createRegisterForm();
    }

    ngOnInit(): void {}

    createRegisterForm(): FormGroup {
        return this.fb.group(
            {
                email: [null, Validators.compose([Validators.email, Validators.required])],
                password: [
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
                        Validators.minLength(6),
                    ]),
                ],
                confirmPassword: [null, Validators.compose([Validators.required])],
            } as AbstractControlOptions,
            {
                // check whether our password and confirm password match
                validator: CustomValidators.passwordMatchValidator,
            } as AbstractControlOptions
        );
    }
    submit() {
        if (this.debug) console.log(`RegisterAccountComponent register`);
        if (this.frmRegister.valid) {
            this.buttonSpinner = true;
            const vm: RegisterAccountVM = {
                displayName: null,
                email: this.frmRegister["controls"].email.value,
                password: this.frmRegister["controls"].password.value,
                confirmPassword: this.frmRegister["controls"].confirmPassword.value,
                returnUrl: this.authService.returnUrl,
            };
            this.accountService
                .registerAccount(vm)
                .pipe(take(1))
                .subscribe(
                    data => {
                        if (data.statusCode == 200) {
                            const url = (<ApiOkResult<any>>data).redirectUrl;
                            if (this.debug) console.log(`RegisterAccountComponent redirect:${url}`);
                            this.router.navigateByUrl(url);
                        } else {
                            this.modelErrors = (<ApiBadRequestResponse>data).errors;
                            this.buttonSpinner = false;
                        }
                    },
                    error => {
                        this.buttonSpinner = false;
                    }
                );
        }
    }
}
