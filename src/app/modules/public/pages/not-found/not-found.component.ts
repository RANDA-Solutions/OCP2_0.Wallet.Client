import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { AppService } from "@core/services/app.service";

@Component({
    selector: "app-not-found",
    templateUrl: "./not-found.component.html",
    styleUrls: ["./not-found.component.scss"],
})
export class NotFoundComponent implements OnInit {
    constructor(
        private appService: AppService,
        private location: Location
    ) {}

    ngOnInit(): void {}
}
