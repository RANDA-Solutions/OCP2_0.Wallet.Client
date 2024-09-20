import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AppService } from "@core/services/app.service";
import { UtilsService } from "@core/services/utils.service";
import { Observable, of } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { SecurityObject } from "../../auth/securityObject";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    securityObject: SecurityObject;
    private debug = false;
    constructor(
        private appService: AppService,
        private authService: AuthService,
        private router: Router,
        private utils: UtilsService
    ) {}

    // canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    // 	return of(this.authService.isLoggedIn());
    // }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean | Observable<UrlTree> {
        if (this.debug) console.log(`AuthGuard0 next: ${next} stat: ${state}`);
        // Get property name on security object to check
        const role: string = next.data["role"];
        if (role) {
            //requires role
            if (this.authService.hasRole(role)) {
                //user has role
                return true;
            }
            return of(this.router.createUrlTree(["public/access-denied"], { queryParams: { returnUrl: state.url } }));
        }

        if (!this.authService.isUserLoggedIn()) {
            this.authService.storeReturnUrl(state.url);
            if (this.debug) console.log(`AuthGuard1 nav /access/login`);
            return of(this.router.createUrlTree(["/access/login"]));
        } else {
            return true;
        }
    }
}
