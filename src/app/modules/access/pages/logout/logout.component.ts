import { Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { environment } from "@environment/environment";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: "app-logout",
    templateUrl: "./logout.component.html",
    styleUrls: ["../../access-styles.scss"],
})
export class LogoutComponent implements OnInit {
    message = "logging out";
    private _infoMessage?: string;

    constructor(
        private authService: AuthService,
        private router: Router,
        private ngZone: NgZone,
        private activeRoute: ActivatedRoute
    ) {
        this.activeRoute.queryParams.pipe(untilDestroyed(this)).subscribe((param: any) => {
            this._infoMessage = param["infoMessage"];
            if (environment.debug) console.log("LogoutComponent", this._infoMessage);
        });
    }

    ngOnInit() {
        var self = this;
        setTimeout(
            self => {
                this.ngZone.run(() => {
                    this.authService.logout().subscribe(() => {
                        if (environment.debug) console.log("LogoutComponent ngOnInit", this._infoMessage);
                        this.router.navigate(["/access/login"], { queryParams: { infoMessage: this._infoMessage } });
                    });
                }, self);
            },
            500,
            [self]
        );
    }
}
