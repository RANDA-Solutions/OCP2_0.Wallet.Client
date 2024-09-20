import { Component, OnInit } from "@angular/core";
import { AppService } from "@core/services/app.service";
import { environment } from "@environment/environment";

@Component({
    selector: "[app-public-nav]",
    templateUrl: "./public-nav.component.html",
    styleUrls: ["./public-nav.component.scss"],
})
export class PublicNavComponent implements OnInit {
    private debug = false;
    environment = environment;
    constructor(public appService: AppService) {}
    ngOnInit() {
        if (this.debug) console.log(`PublicNavComponent ngOnInit`);
    }
}
