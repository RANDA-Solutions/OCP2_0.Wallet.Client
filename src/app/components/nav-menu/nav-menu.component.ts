import { Component, Input, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { AppService } from "@core/services/app.service";
import { environment } from "@environment/environment";
import { faBars, faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { AccessService } from "@modules/access/services/access.service";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Subscription } from "rxjs";
import { filter, map, mergeMap, take } from "rxjs/operators";
@UntilDestroy()
@Component({
    selector: "app-nav-menu",
    templateUrl: "./nav-menu.component.html",
    styleUrls: ["./nav-menu.component.scss"],
})
export class NavMenuComponent implements OnInit {
    faBars = faBars;
    faTimes = faTimes;
    faChevronDown = faChevronDown;
    public showAddCredential: boolean = false;

    public isExpanded = false;
    public isAuthenticated: boolean;
    public userName: string;
    public showNavMenu: boolean;
    public isSysAdmin: boolean;
    public isLoggedIn: boolean;
    private footerSettingsSubscription: Subscription;
    private debug = false;

    environment = environment;

    constructor(
        public authService: AuthService,
        private accessService: AccessService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appService: AppService,
        private ngZone: NgZone
    ) {
        this.showNavMenu = true;
    }

    checkRole(role: string) {
        if (this.debug) console.log("NavMenuComponent checkRole", role, this.authService.hasRole(role));

        return this.authService.hasRole(role);
    }

    ngOnInit() {
        if (this.debug) console.log("NavMenuComponent ngOnInit");

        this.footerSettingsSubscription = this.appService.footerSettings$.subscribe(settings => {
            this.showAddCredential = settings?.showAddCredential ?? false;
        });

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.activatedRoute),
                map(route => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                })
            )
            .pipe(
                filter(route => route.outlet === "primary"),
                mergeMap(route => route.data)
            )
            .subscribe(event => {
                this.showNavmenu(event.hideNavBar); // show the navmenu?
            });
    }

    ngOnDestroy() {
        if (this.footerSettingsSubscription) {
            this.footerSettingsSubscription.unsubscribe();
        }
    }

    collapse() {
        if (this.debug) console.log("NavMenuComponent collapse", this.isExpanded);

        this.isExpanded = false;
    }

    toggle() {
        if (this.debug) console.log("NavMenuComponent toggle", this.isExpanded);

        this.isExpanded = !this.isExpanded;
    }

    showNavmenu(event) {
        if (this.debug) console.log("NavMenuComponent showNavmenu", event);

        if (event === false) {
            this.showNavMenu = true;
        } else if (event === true) {
            this.showNavMenu = false;
        } else {
            this.showNavMenu = this.showNavMenu;
        }
    }

    logout(infoMessage?: string) {
        if (this.debug) console.log("NavMenuComponent logout", infoMessage);

        this.accessService
            .signOut(infoMessage)
            .pipe(take(1))
            .subscribe(data => {
                this.goToLogout(infoMessage);
            });
    }

    private goToLogout(infoMessage?: string) {
        if (this.debug) console.log("NavMenuComponent goToLogout", infoMessage);

        this.ngZone.run(
            (infoMessage?: string) => {
                this.router.navigate(["/access/logout"], {
                    queryParams: { infoMessage: infoMessage },
                    replaceUrl: true,
                });
            },
            this,
            [infoMessage]
        );
    }
}
