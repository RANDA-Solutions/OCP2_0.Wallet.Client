import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { ShareService } from "@modules/shares/services/share.service";
import { ShareDetailsResponseModel } from "@modules/shares/services/shareDetailsResponseModel";
import { ShareListResponseModel } from "@modules/shares/services/shareResponseModel";
import { ApiOkResult } from "@shared/models/apiOkResponse";

@Component({
    selector: "[app-share-history-card]",
    templateUrl: "./share-history-card.component.html",
    styleUrls: ["./share-history-card.component.scss"],
})
export class ShareHistoryCardComponent implements OnInit {
    faChevronUp = faChevronUp;
    faChevronDown = faChevronDown;
    @Input() share: ShareListResponseModel;
    shareDetails: ShareDetailsResponseModel = null;
    showDetails: boolean = false;
    showSpinner: boolean = false;
    private debug: boolean = true;
    constructor(
        private utilService: UtilsService,
        private shareService: ShareService
    ) {}

    ngOnInit() {
        if (this.debug) console.log("ShareHistoryCardComponent ngOnInit", this.share);
    }

    formatDateToLocal(dt: Date) {
        return this.utilService.formatDateToLocal(dt);
    }

    toggleExpand() {
        if (this.debug) console.log("ShareHistoryCardComponent toggleExpand", this.share);
        this.showDetails = !this.showDetails;

        // load details if not already loaded
        if (!this.shareDetails) this.getDetails();
    }

    getDetails() {
        this.showSpinner = true;
        if (this.debug) console.log("ShareHistoryCardComponent getDetails", this.share);
        this.shareService.get(this.share.shareId).subscribe(data => {
            if (data.statusCode == 200) {
                this.shareDetails = (<ApiOkResult<ShareDetailsResponseModel>>data).result;
            } else {
                this.shareDetails = null;
            }
            this.showSpinner = false;
        });
    }
}
