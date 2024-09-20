import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { AppService } from "@core/services/app.service";
import { environment } from "@environment/environment";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Credentials } from "@shared/interfaces/credentials.interface";
import { EMPTY, Subscription } from "rxjs";
import { catchError, take } from "rxjs/operators";

@UntilDestroy()
@Component({
    selector: "app-login-form",
    templateUrl: "./login-form.component.html",
    styleUrls: ["./login-form.component.scss", "../../access-styles.scss"],
    host: {
        class: "h-100",
    },
})
export class LoginFormComponent implements OnInit {
    showMe = false;
    externalApiUrl = `${environment.publicEndPoint}account/login/external/`;
    modelErrors = new Array<string>();
    brandNew: boolean;
    errors: string;
    loginSpinner = false;
    showSpinner = true;
    submitted = false;
    credentials: Credentials = { email: "", password: "" };
    infoMessage?: string;
    message = "loading";
    termsOfServiceUrl: string | null;

    private footerSettingsSubscription: Subscription;
    private routerSubscription: Subscription;
    private returnUrl: string | null;
    private debug = false;

    constructor(
        private appService: AppService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/home";

        if (this.debug) console.log(`LoginFormComponent ngOnInit`);

        this.footerSettingsSubscription = this.appService.footerSettings$
            .pipe(untilDestroyed(this))
            .subscribe(settings => {
                this.termsOfServiceUrl = settings?.termsOfServiceUrl;
            });

        // subscribe to router event
        this.routerSubscription = this.route.queryParams.pipe(untilDestroyed(this)).subscribe((param: any) => {
            this.infoMessage = history.state.infoMessage;

            const currentTitle = document.title;
            const currentUrl = window.location.href;

            // clear state
            history.replaceState({ infoMessage: null, ...history.state }, currentTitle, currentUrl);

            this.brandNew = param["brandNew"];
            this.credentials.email = param["email"];
            if (this.returnUrl?.startsWith("/connect/authorize/callback") == false) {
                this.authService.storeReturnUrl(this.returnUrl);
            } else {
                this.returnUrl = "";
                history.pushState({}, null, `${window.location.origin}/access/login`);
            }
        });

        this.authService
            .checkLogin()
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    this.showSpinner = false;
                    this.showMe = true;
                    return EMPTY;
                })
            )
            .subscribe(loggedIn => {
                if (this.debug) {
                    console.log("LoginForm: ", loggedIn);
                }
                if (loggedIn) {
                    this.doNavigation("checkLogin");
                } else {
                    this.showMe = true;
                    this.showSpinner = false;
                }
            });
    }

    login({ value, valid }: { value: Credentials; valid: boolean }) {
        if (this.debug) console.log(`LoginFormComponent login`);
        this.submitted = true;
        this.modelErrors = new Array<string>();
        if (valid) {
            this.loginSpinner = true;
            this.authService
                .login(value)
                .pipe(take(1))
                .subscribe(
                    data => {
                        if (this.debug) console.log("LoginFormComponent returned from api/Login result:", data);
                        if (this.authService.isUserLoggedIn()) {
                            this.doNavigation("checkLogin");
                        }
                    },
                    error => {
                        this.modelErrors.push("The provided credentials are not valid.  Please try again.");
                        this.loginSpinner = false;
                    }
                );
        }
    }
    doNavigation(from: string) {
        if (this.debug)
            console.log(
                `LoginFormComponent doNavigation from: ${from} prev:${this.appService.previousUrl} curr:${this.appService.nextUrl} next:${this.appService.nextUrl} return:${this.authService.returnUrl} `
            );
        if (from == "checkLogin") {
            if (this.significantUrl(this.appService.nextUrl) && this.appService.nextUrl != this.appService.currentUrl) {
                if (this.debug)
                    console.log(`LoginFormComponent doNavigation using nextUrl: ${this.appService.nextUrl}`);
                this.router.navigate([this.appService.nextUrl]);
            } else if (this.significantUrl(this.appService.currentUrl)) {
                if (this.debug)
                    console.log(`LoginFormComponent doNavigation using currentUrl: ${this.appService.currentUrl}`);
                this.router.navigate([this.appService.currentUrl]);
            } else if (this.significantUrl(this.authService.returnUrl)) {
                if (this.debug)
                    console.log(`LoginFormComponent doNavigation using returnUrl: ${this.authService.returnUrl}`);
                this.router.navigate([this.authService.returnUrl]);
            } else if (this.significantUrl(this.appService.previousUrl)) {
                if (this.debug)
                    console.log(`LoginFormComponent doNavigation using previousUrl: ${this.appService.currentUrl}`);
                this.router.navigate([this.appService.previousUrl]);
            } else {
                if (this.debug) console.log(`LoginFormComponent doNavigation using /credentials`);
                this.router.navigate(["/home"]);
            }
        }

        if (from == "loginSuccess") {
            let returnUrl = this.authService.returnUrl;
            if (returnUrl) {
                if (returnUrl.includes(environment.baseUrl)) {
                    returnUrl = returnUrl.replace(environment.baseUrl, "");
                }
                this.authService.clearReturnUrl();
                this.router.navigateByUrl(returnUrl);
            } else {
                this.router.navigate(["/home"]);
            }
        }

        this.loginSpinner = false;
    }
    significantUrl(url: string) {
        if (url == null) return false;
        if (url == undefined) return false;
        if (url == "") return false;
        if (url == "null") return false;
        if (url == "/") return false;
        if (url.startsWith("/access/setup")) return false;
        if (url.startsWith("/access/login")) return false;
        if (this.debug) console.log(`LoginFormComponent significantUrl: ${url}`);
        return true;
    }

    external(name) {
        if (!!this.returnUrl) return `${this.externalApiUrl}${name}?returnUrl=${this.returnUrl}`;
        return `${this.externalApiUrl}${name}`;
    }

    localError() {
        throw Error("The app component has thrown an error!");
    }
}
