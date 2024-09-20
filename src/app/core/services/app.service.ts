import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";
import { AuthService } from "@auth/auth.service";
import { environment } from "@environment/environment";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ApiOkResponse } from "@shared/models/apiOkResponse";
import { ApiResponse } from "@shared/models/apiResponse";
import { FooterSettingsResponseModel } from "@shared/models/footerSettingsResponseModel";
import { BehaviorSubject, Observable, Subject, Subscription, of, throwError } from "rxjs";
import { catchError, filter, take } from "rxjs/operators";
import { UtilsService } from "./utils.service";

@UntilDestroy()
@Injectable()
export class AppService {
    public disconnectedPage = false;
    public nextUrl = "";
    public currentUrl = "";
    public previousUrl = "";
    public completeInvitationFlow: string = "complete-invitation";
    public completeInvitationMethod: string = "ConnectionStatus";
    public generateInvitationFlow: string = "generate-invitation";
    public generateInvitationMethod: string = "InvitationStatus";
    public proofFlow: string = "proof";
    public proofMethod: string = "ProofRequestStatus";
    public credentialStatusFlow: string = "credential-status";
    public credentialStatusMethod: string = "CredentialStatus";
    public currentYear: number = new Date().getFullYear();

    private footerSettingsSubject = new BehaviorSubject<FooterSettingsResponseModel | null>(null);
    footerSettings$ = this.footerSettingsSubject.asObservable();

    private _loggedInBehavior = new BehaviorSubject<boolean>(false);
    loggedIn$ = this._loggedInBehavior.asObservable();

    private _hubs: { [name: string]: HubConnection } = {};
    private debug = false;
    private routerSubscription: Subscription;

    connectionCompleted = new EventEmitter<Boolean>();

    proofFinished = new EventEmitter<boolean>();
    proofStatusChanged = new EventEmitter<string>();

    private latestUrlSource = new Subject<string>();
    latestUrl$ = this.latestUrlSource.asObservable();

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService,
        public authService: AuthService,
        private router: Router
    ) {
        if (this.debug) console.log(`AppService constructor`);
        this.currentUrl = localStorage.getItem("currentUrl");
        this.previousUrl = localStorage.getItem("previousUrl");
        this.nextUrl = localStorage.getItem("nextUrl");
        // authService.securityObject$
        // 	.pipe(untilDestroyed(this)).subscribe(val => {
        //     if (this.debug) console.log(`AppService role: ${val.role}`);
        //     this.securityObject = val;
        //   });
        this.getFooterSettings();

        this.routerSubscription = this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                untilDestroyed(this)
            )
            .subscribe((event: NavigationEnd) => {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
                this.nextUrl = this.currentUrl;
                localStorage.setItem("previousUrl", this.previousUrl);
                localStorage.setItem("currentUrl", this.currentUrl);
                localStorage.setItem("nextUrl", this.nextUrl);
                if (this.debug) console.log(`AppService currentUrl is now ${event.url}`);
                this.latestUrlSource.next(this.currentUrl);
                if (
                    this.currentUrl.includes("/Public/Links/Display") ||
                    this.currentUrl.includes("/s/") ||
                    this.currentUrl.includes("/chapi/")
                ) {
                    this.disconnectedPage = true;
                } else {
                    this.disconnectedPage = false;
                }
            });
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationStart),
                untilDestroyed(this)
            )
            .subscribe((event: NavigationStart) => {
                this.nextUrl = event.url;
                localStorage.setItem("nextUrl", this.currentUrl);
            });
    }
    getConsent(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}Public/ConsentCheck`;
        if (this.debug) console.log(`AppService ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    getFooterSettings(): void {
        const urlApi = `${environment.apiEndPoint}Public/FooterSettings`;
        if (this.debug) console.log(`AppService ${urlApi}`);
        this.http.get<ApiResponse>(urlApi).subscribe(data => {
            if (this.debug) console.log(`AppService.getFooterSettings:${JSON.stringify(data)}`);
            const footerSettings = (<ApiOkResponse>data).result as FooterSettingsResponseModel;

            this.footerSettingsSubject.next(footerSettings);
        });
    }

    public setNextUrl(url: string) {
        this.nextUrl = url;
        localStorage.setItem("nextUrl", this.nextUrl);
    }
}
