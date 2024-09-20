import { Component, Input } from "@angular/core";
import { VerifyEmailResponseModel } from "@shared/models/verifyEmailResponseModel";

@Component({
    selector: "[app-no-account]",
    templateUrl: "./no-account.component.html",
    styleUrls: ["./no-account.component.scss"],
})
export class NoAccountComponent {
    @Input() email: string;
}
