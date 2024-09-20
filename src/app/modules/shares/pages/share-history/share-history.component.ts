import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ShareService } from "@modules/shares/services/share.service";
import { ShareListResponseModel } from "@modules/shares/services/shareResponseModel";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";

@Component({
    templateUrl: "./share-history.component.html",
    styleUrls: ["./share-history.component.scss"],
})
export class ShareHistoryComponent implements OnInit {
    shareListResponses: ShareListResponseModel[] = new Array<ShareListResponseModel>();
    modelErrors = new Array<string>();
    showSpinner = false;
    private debug = false;

    constructor(
        private shareService: ShareService,
        @Inject(DOCUMENT) private document: any
    ) {}

    async ngOnInit() {
        if (this.debug) console.log("ShareHistoryComponent ngOnInit");

        this.getData();
    }

    getData(): void {
        this.showSpinner = true;
        if (this.debug) console.log("ShareHistoryComponent getData");
        this.shareService.list().subscribe(data => {
            if (this.debug) console.log("ShareHistoryComponent getData data", data);
            if (data.statusCode == 200) {
                this.shareListResponses = (<ApiOkResult<ShareListResponseModel[]>>data).result;
            } else {
                this.shareListResponses = new Array<ShareListResponseModel>();
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.showSpinner = false;
        });
    }
}
