import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "@core/services/app.service";
import { environment } from "@environment/environment";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
    selector: "app-login-layout",
    styleUrls: ["./login-layout.component.scss"],
    templateUrl: "./login-layout.component.html",
})
export class LoginLayoutComponent implements OnInit {
    bgClass = "bg-gradient-darkblue-aqua";
    isMenuCollapsed = true;
    debug: boolean = false;
    environment = environment;
    currentYear = new Date().getFullYear();

    constructor(
        private appService: AppService,
        private router: Router
    ) {
        this.appService.latestUrl$.pipe(untilDestroyed(this)).subscribe(data => {});
    }
    ngOnInit() {
        if (this.debug) console.log(`LoginLayoutComponent ngOnInit ${this.appService.currentUrl}`);
    }
}
