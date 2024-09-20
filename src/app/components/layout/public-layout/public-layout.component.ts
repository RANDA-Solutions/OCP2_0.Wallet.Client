import { Component, OnInit } from "@angular/core";
import { AppService } from "@core/services/app.service";

@Component({
    selector: "app-public-layout",
    styleUrls: ["./public-layout.component.scss"],
    templateUrl: "./public-layout.component.html",
})
export class PublicLayoutComponent implements OnInit {
    private debug = false;
    constructor(public appService: AppService) {}
    ngOnInit() {
        if (this.debug) console.log(`PublicLayoutComponent ngOnInit`);
    }
}
