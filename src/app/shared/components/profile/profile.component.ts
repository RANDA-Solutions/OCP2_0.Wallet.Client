import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { Profile } from "@shared/models/profile";
import { take } from "rxjs/operators";
import { ProfileService } from "./profile.service";
import { Observable } from "rxjs";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faPencil, faTrophy, faFolderOpen, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnDestroy, OnInit {
    faCircleUser = faCircleUser;
    faPencil = faPencil;
    faTrophy = faTrophy;
    faFolderOpen = faFolderOpen;
    faGraduationCap = faGraduationCap;
    @Input() showEditProfile: boolean = true;
    profile = new Profile();
    showSpinner = false;
    private debug = false;

    constructor(private profileService: ProfileService) {}

    ngOnInit() {
        if (this.debug) console.log("profile ngOnInit");

        // in case we need to be refreshed
        this.profileService.refreshTrigger.subscribe(() => this.getData());

        this.getData();
    }

    ngOnDestroy(): void {}

    getData(): any {
        this.showSpinner = true;
        if (this.debug) console.log("profile getData");
        this.profileService.getProfile().subscribe(data => {
            if (this.debug) console.log("profile getData", data);
            if (data.statusCode == 200) {
                this.profile = (<ApiOkResult<Profile>>data).result;
            } else {
                this.profile = new Profile();
            }
            this.showSpinner = false;
        });
    }
}
