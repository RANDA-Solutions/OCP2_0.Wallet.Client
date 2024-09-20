import { RouterModule, Routes } from "@angular/router";
import { AccessComponent } from "./access.component";
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

export const accessRoutes: Routes = [
    {
        path: "",
        component: AccessComponent,
        data: { hideNavBar: true },
        children: [
            {
                path: "resend-confirmation",
                component: ResendConfirmationComponent,
                data: { hideNavBar: true },
            },
            {
                path: "forgot-password",
                component: ForgotPasswordComponent,
                data: { hideNavBar: true },
            },
            {
                path: "forgot-password-confirmation",
                component: ForgotPasswordConfirmationComponent,
                data: { hideNavBar: true },
            },
            {
                path: "reset-password",
                component: ResetPasswordComponent,
                data: { hideNavBar: true },
            },
            {
                path: "reset-password-confirmation",
                component: ResetPasswordConfirmationComponent,
                data: { hideNavBar: true },
            },
            {
                path: "email-confirmation",
                component: EmailConfirmationComponent,
                data: { hideNavBar: true },
            },
            {
                path: "register-confirmation",
                component: RegisterConfirmationComponent,
                data: { hideNavBar: true },
            },
            {
                path: "login",
                component: LoginFormComponent,
                data: { hideNavBar: true },
            },
            {
                path: "logout",
                component: LogoutComponent,
                data: { hideNavBar: true },
            },
            {
                path: "register",
                component: RegisterAccountComponent,
                data: { hideNavBar: true },
            },
            {
                path: "setup",
                component: SetupAccountComponent,
                data: { hideNavBar: true },
            },
            { path: "confirm-email-change", component: ConfirmEmailChangeComponent },
            {
                path: "",
                component: LoginFormComponent,
                data: { hideNavBar: true },
            },
        ],
    },
];

export const AccessRouterModule = RouterModule.forChild(accessRoutes);
