import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShareAccessService } from "../../services/share-access.service";
import { PublicShareDetailResponseViewModel } from "../../services/publicShareDetailResponseViewModel";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { PublicShareRequestViewModel } from "../../services/publicShareRequestViewModel";
import { ApiResponse } from "@shared/models/apiResponse";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";

@Component({
    selector: "app-share-details",
    templateUrl: "./share-details.component.html",
    styleUrls: ["./share-details.component.scss"],
})
export class ShareDetailsComponent implements OnInit {
    publicShareDetailResponse: PublicShareDetailResponseViewModel = new PublicShareDetailResponseViewModel();
    shareId: string | null = null;
    hash: string | null = null;
    code: string | null = null;
    showSpinner = false;
    modelErrors = new Array<string>();
    debug: boolean = false;
    accessCode: string;

    constructor(
        private route: ActivatedRoute,
        private shareAccessService: ShareAccessService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.shareId = params.get("shareid");
        });

        this.route.queryParamMap.subscribe(params => {
            this.hash = params.get("hash");
            this.code = params.get("code");
        });

        this.getData();
    }
    getData() {
        this.showSpinner = true;
        if (this.debug) console.log("ShareDetailsComponent getData");

        let publicShareRequestViewModel: PublicShareRequestViewModel = {
            hash: this.hash,
            code: this.code,
        };

        this.shareAccessService.getShareDetails(this.shareId, publicShareRequestViewModel).subscribe(
            (data: ApiResponse) => {
                if (this.debug) console.log("PublicShareRequestViewModel handleSubmit", data);
                console.log(data.statusCode);
                if (data.statusCode == 200) {
                    this.publicShareDetailResponse = (<ApiOkResult<PublicShareDetailResponseViewModel>>data).result;
                } else {
                    this.modelErrors = (<ApiBadRequestResponse>data).errors;
                }
                this.showSpinner = false;
            },
            error => {
                this.modelErrors = error;
                if (this.debug) console.log("PublicShareRequestViewModel handleSubmit", error);
                this.showSpinner = false;
            }
        );
    }
}
