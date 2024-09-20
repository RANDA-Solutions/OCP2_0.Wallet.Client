import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppService } from "@core/services/app.service";
import { FooterSettingsResponseModel } from "@shared/models/footerSettingsResponseModel";
import { Subscription } from "rxjs";

@Component({
    selector: "[app-public-footer]",
    templateUrl: "./public-footer.component.html",
    styleUrls: ["./public-footer.component.scss"],
})
export class PublicFooterComponent implements OnInit, OnDestroy {
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
