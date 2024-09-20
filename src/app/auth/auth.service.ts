import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Injector, OnDestroy } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "@environment/environment";
import { BehaviorSubject, Observable, Subscription, of, throwError } from "rxjs";
import { catchError, map, share, tap } from "rxjs/operators";
import { IGNORE_AUTH_ENDPOINTS } from "./auth.constants";
import posthog from "posthog-js";
@Injectable({
    providedIn: "root",
})
export class AuthService implements OnDestroy {
    public returnUrlKey = "originalReturnUrl";

    private debug = false;
    private _jwtHelper: JwtHelperService;

    private _tokenString: string = "currentUser";
    private _baseUrl = environment.baseUrl + "/api";

    private _currentUserSubject = new BehaviorSubject<any>(null);
    private _currentUser: any;
    public currentUser$ = this._currentUserSubject.asObservable();

    private _isLoggedIn: boolean = false;
    private _isLoggedInSubject = new BehaviorSubject<boolean>(this._isLoggedIn);
    public isLoggedIn$ = this._isLoggedInSubject.asObservable();

    private _isImpersonating: boolean = false;

    private sub: Subscription = new Subscription();

    public accessTokenExpiring: EventEmitter<any> = new EventEmitter<any>();
    public accessTokenExpired: EventEmitter<any> = new EventEmitter<any>();
    public silentRenewError: EventEmitter<any> = new EventEmitter<any>();
    public userLoaded: EventEmitter<any> = new EventEmitter<any>();
    public userSignedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
    public userSessionChanged: EventEmitter<any> = new EventEmitter<any>();
    public userUnloaded: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private injector: Injector,
        private _http: HttpClient
    ) {
        //super();

        this._jwtHelper = new JwtHelperService();
        const localStorageResult = localStorage.getItem(this._tokenString);
        if (localStorageResult) {
            this._currentUser = JSON.parse(localStorageResult);
        } else {
            this._currentUser = null;
        }

        if (!this.isLoggedIn(this._currentUser)) {
            this.clearCurrentUser();
        } else {
            this._isImpersonating = this._currentUser.isImpersonating;
        }

        this._currentUserSubject.next(this._currentUser);

        this.sub.add(
            this.currentUser$.subscribe((cu: any) => {
                this._isLoggedIn = this.isLoggedIn(cu);
                this._isLoggedInSubject.next(this._isLoggedIn);
                if (this._isLoggedIn) {
                    this.userLoaded.emit(cu);
                    this.userSignedIn.emit(true);
                } else {
                    this.userUnloaded.emit(cu);
                    this.userSignedIn.emit(false);
                }
            })
        );
    }
    ngOnDestroy(): void {
        if (this.debug) console.log("Destroying auth.service");
        this.sub.unsubscribe();
    }

    getAccessToken(): string {
        return this._currentUser?.authToken;
    }

    private ignoreRequestedEndpoint(url: string): boolean {
        return IGNORE_AUTH_ENDPOINTS.some(rx => rx.test(url));
    }

    public isUserLoggedIn(): boolean {
        return this.isLoggedIn(this._currentUser);
    }

    private isLoggedIn(user: any): boolean {
        if (user) {
            const isTokenExpired = this._jwtHelper.isTokenExpired(user.authToken);
            if (!isTokenExpired) {
                return true;
            } else {
                this.accessTokenExpired.emit();
            }
        }
        return false;
    }

    getCurrentUser(): any {
        return this._currentUser;
    }

    isImpersonating(): boolean {
        return this._currentUser != null && this._currentUser.isImpersonating;
    }

    login(args: any): Observable<any> {
        return this._http.post<any>(this._baseUrl + "/authenticate/login", args, { withCredentials: true }).pipe(
            tap((loginResult: any) => {
                if (loginResult && loginResult.token) {
                    this.setCurrentUser(loginResult);
                }
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    public checkLogin() {
        return this.getUser();
    }

    updateLoginQuiet(loginResult: any) {
        this._currentUser = { authToken: loginResult.token, refreshToken: loginResult.token };
        this.storeCurrentUser();
    }

    updateLogin(loginResult: any) {
        this.setCurrentUser(loginResult);
    }

    getUser(): Observable<boolean> {
        return this._http.post<any>(this._baseUrl + "/authenticate/refresh", {}, { withCredentials: true }).pipe(
            map((refresh: any) => {
                if (refresh && refresh.token) {
                    this.setCurrentUser(refresh);
                    return true;
                }
                return false;
            })
        );
    }

    isUser(userId: number): boolean {
        const currentUser = this.getCurrentUser();
        if (!currentUser || currentUser.userId !== userId) return false;

        return true;
    }

    /*
  Submits a shareable request for a refreshed authorzation token so that multiple requests do not get sent
  */
    refreshToken(): Observable<string> {
        return this._http.post<any>(this._baseUrl + "/authenticate/refresh", {}, { withCredentials: true }).pipe(
            share(),
            map((refresh: any) => {
                if (refresh && refresh.token) {
                    this.setCurrentUser(refresh);
                    return this._currentUser.authToken;
                } else {
                    this._isLoggedInSubject.next(false);
                    //this._logService.log(this, this._currentUser, 'Bad Refresh: ' + JSON.stringify(this.getTimeoutInformation()));
                    return null;
                }
            })
        );
    }

    logout() {
        if (!this._currentUser) {
            return of();
        }

        return this.clearCurrentUser(true);
    }

    useAuthToken(): Observable<string> {
        return of(this._currentUser?.authToken);
    }

    getAuthToken(): Observable<string> {
        if (!this._currentUser) {
            return this.refreshToken();
        }

        let isTokenExpired = this._jwtHelper.isTokenExpired(
            this._currentUser.authToken,
            this._currentUser.timeOffset / 1000
        );

        if (!isTokenExpired) {
            return of(this._currentUser.authToken);
        }

        return this.refreshToken();
    }

    updateUserDisplay(firstName: string, lastName: string) {
        this._currentUser.firstName = firstName;
        this._currentUser.lastName = lastName;

        this.setCurrentUser(this._currentUser);
    }

    getPin(): string {
        return this._currentUser.pin;
    }

    generateNewPin() {
        return this._http.put<any>(environment.baseUrl + "/profile/pin/reset", {}).pipe(
            tap((result: any) => {
                this._currentUser.pin = result.data;
                this.storeCurrentUser();
            })
        );
    }

    storeReturnUrl(returnUrl) {
        if (this.debug) console.log(`AuthService Storing return url: ${returnUrl}`);
        localStorage.setItem(this.returnUrlKey, returnUrl);
    }
    // storeReturnUrl(returnUrl: string): void {

    // }
    clearReturnUrl() {
        if (this.debug) console.log(`AuthService Clearing return url: ${this.returnUrl}`);
        localStorage.removeItem(this.returnUrlKey);
    }

    get returnUrl() {
        return localStorage.getItem(this.returnUrlKey);
    }

    // private getTimeoutInformation() {
    //   if (this._currentUser) {
    //     return {
    //       userId: this._currentUser.userId,
    //       refreshExpiration: this._currentUser.refreshExpiration,
    //       timeOffset: this._currentUser.timeOffset,
    //       serverTimestamp: this._currentUser.serverTime,
    //       clientTime: this._currentUser.clientTime,
    //       timeoutTimer: this._currentUser.timeoutOffset
    //     };
    //   } else {
    //     return {
    //       userId: 'NULL'
    //     };
    //   }
    // }

    private clearCurrentUser(broadcast: boolean = false) {
        if (this.debug) console.log("clearing the current user", broadcast);
        this._isImpersonating = false;
        this._currentUser = null;
        this.removeCurrentUser();

        //PostHog User reset session on logout
        if (!!environment.posthogApiKey) {
            posthog.reset();
        }

        if (broadcast) {
            this._currentUserSubject.next(this._currentUser);
        }
        return of(true);
    }

    private setCurrentUser(user: any) {
        let token = this._jwtHelper.decodeToken(user.token);
        if (this.debug) console.log("setCurrentUser", token);
        this._currentUser = {
            email: user.email,
            authToken: user.token,
            refreshToken: user.token,
            roles: user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        };
        this.storeCurrentUser();

        //PostHog User Identify and Set
        if (!!environment.posthogApiKey) {
            posthog.identify(
                user.email.toLocaleUpperCase(),
                { email: user.email.toLocaleUpperCase() } // optional: set person properties
            );
        }
        //this._isImpersonating = this._currentUser.isImpersonating;
        this._currentUserSubject.next(this._currentUser);
    }

    hasRole(role: string): boolean {
        if (!this._currentUser || !this._currentUser.roles) {
            return false;
        }
        return this._currentUser.roles.includes(role);
    }

    private storeCurrentUser() {
        localStorage.setItem(this._tokenString, JSON.stringify(this._currentUser));
    }

    private removeCurrentUser() {
        localStorage.removeItem(this._tokenString);
    }
}
