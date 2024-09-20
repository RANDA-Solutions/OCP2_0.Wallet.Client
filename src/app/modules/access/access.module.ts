import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LogService } from "@core/error-handling/logerror.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "@shared/shared.module";
import { AccessComponent } from "./access.component";
import { AccessRouterModule } from "./access.router";
import { ConfirmEmailChangeComponent } from "./pages/confirm-email-change/confirm-email-change.component";
import { EmailConfirmationComponent } from "./pages/email-confirmation/email-confirmation.component";
import { ForgotPasswordConfirmationComponent } from "./pages/forgot-password/forgot-password-confirmation.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { LoginFormComponent } from "./pages/login-form/login-form.component";
import { LogoutComponent } from "./pages/logout/logout.component";
import { RegisterAccountComponent } from "./pages/register-account/register-account.component";
import { RegisterConfirmationComponent } from "./pages/register-confirmation/register-confirmation.component";
import { ResendConfirmationComponent } from "./pages/resend-confirmation/resend-confirmation.component";
import { ResetPasswordConfirmationComponent } from "./pages/reset-password-confirmation/reset-password-confirmation.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { SetupAccountComponent } from "./pages/setup-account/setup-account.component";
import { AccessService } from "./services/access.service";
import { ResetPasswordResolver } from "./services/reset-password-resolver.service";
import { UpdateAccountComponent } from "./components/update-account/update-account.component";
import { VerifyEmailComponent } from "./components/verify-email/verify-email.component";
import { NoAccountComponent } from "./components/no-account/no-account.component";
import { CodeExpiredComponent } from "./components/code-expired/code-expired.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    imports: [AccessRouterModule, SharedModule, FormsModule, ReactiveFormsModule, NgbModule, FontAwesomeModule],
    declarations: [
        AccessComponent,
        LogoutComponent,
        ConfirmEmailChangeComponent,
        ForgotPasswordComponent,
        ForgotPasswordConfirmationComponent,
        ResendConfirmationComponent,
        ResetPasswordComponent,
        ResetPasswordConfirmationComponent,
        RegisterAccountComponent,
        SetupAccountComponent,
        EmailConfirmationComponent,
        RegisterConfirmationComponent,
        LoginFormComponent,
        UpdateAccountComponent,
        VerifyEmailComponent,
        NoAccountComponent,
        CodeExpiredComponent,
    ],
    providers: [AccessService, ResetPasswordResolver, LogService],
})
export class AccessModule {
    static forRoot(): ModuleWithProviders<AccessModule> {
        return {
            ngModule: AccessModule,
        };
    }
}
