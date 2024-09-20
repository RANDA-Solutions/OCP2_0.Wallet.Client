import { Component, OnInit } from "@angular/core";
import { AppService } from "@core/services/app.service";
import { FooterSettingsResponseModel } from "@shared/models/footerSettingsResponseModel";
import { Subscription } from "rxjs";

@Component({
    selector: "app-site-footer",
    styleUrls: ["./site-footer.component.scss"],
    templateUrl: "./site-footer.component.html",
})
export class SiteFooterComponent implements OnInit {
    showFooter: boolean = false;
    currentYear: number;
    private footerSettingsSubscription: Subscription;

    constructor(private appService: AppService) {}

    ngOnInit(): void {
        this.footerSettingsSubscription = this.appService.footerSettings$.subscribe(footerSettings => {
            this.showFooter = footerSettings?.showFooter ?? false;
        });

        this.currentYear = this.appService.currentYear;
    }

    ngOnDestroy() {
        if (this.footerSettingsSubscription) {
            this.footerSettingsSubscription.unsubscribe();
        }
    }
}
