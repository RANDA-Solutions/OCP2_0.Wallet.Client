import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { IGNORE_AUTH_ENDPOINTS, IGNORE_REFRESH_ENDPOINTS } from "@auth/auth.constants";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AuthService } from "../../auth/auth.service";

@Injectable({
    providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
    private debug = false;
    private _activeAuthRequest: Observable<unknown> | any;
    private _ignoreEndpoints = IGNORE_AUTH_ENDPOINTS;
    private _ignoreRefreshEndpoints = IGNORE_REFRESH_ENDPOINTS;

    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // console.log('inside jwt interceptor: ', req);

        if (this.ignoreRequestedEndpoint(req.url)) {
            return next.handle(req);
        }

        this._activeAuthRequest = this._authService.useAuthToken();

        return this._activeAuthRequest.pipe(
            switchMap((token: string) => {
                this._activeAuthRequest = null;

                if (token == null) {
                    // console.log('token from auth request is null...logging out');
                    // this.logoutUser();
                    // return EMPTY;
                    if (this.debug) {
                        console.log("token from auth request is null, trying url: ", req.url);
                    }
                    return next.handle(req);
                }

                return this.resubmitRequest(req, next, token);
            }),
            catchError((error: HttpErrorResponse) => {
                if (this.ignoreRequestedEndpoint(error.url)) {
                    console.log("error w/ignore endpoints...logging user out");
                    this.logoutUser();
                    return EMPTY;
                }

                if (error.status === 401 && !this.ignoreRefreshEndpoint(req.url)) {
                    if (this.debug) console.log("error 401 with url: ", req.url);
                    return this.handle401Error(req, next, error);
                } else {
                    // this throws error
                    return throwError(error);
                }
            })
        );
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse) {
        if (!this._activeAuthRequest) {
            this._activeAuthRequest = this._authService.refreshToken();
        }

        return this._activeAuthRequest.pipe(switchMap((token: string) => this.resubmitRequest(req, next, token)));
    }

    private addTokenHeader(req: HttpRequest<any>, token: string) {
        if (!token) return req;

        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    private ignoreRefreshEndpoint(url: string): boolean {
        return this._ignoreRefreshEndpoints.some(rx => rx.test(url));
    }

    private ignoreRequestedEndpoint(url: string | null): boolean {
        if (!url) return false;
        if (this.debug) console.log("TokenInterceptorService ignoreRequestedEndpoint: ", url);
        return this._ignoreEndpoints.some(rx => rx.test(url));
    }

    private resubmitRequest(req: HttpRequest<any>, next: HttpHandler, token: string) {
        this._activeAuthRequest = null;

        return next.handle(this.addTokenHeader(req, token));
    }

    private logoutUser() {
        console.log("logging out user inside jwt");
        this._authService.logout().subscribe(() => {
            console.log("logging out user in jwt interceptor");
            this._router.navigate(["/login"]);
        });
    }
}
