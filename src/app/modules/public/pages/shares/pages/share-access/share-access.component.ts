import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ShareAccessService } from "../../services/share-access.service";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiResponse } from "@shared/models/apiResponse";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { PublicShareResponseViewModel } from "../../services/publicShareResponseViewModel";
import { PublicShareRequestViewModel } from "../../services/publicShareRequestViewModel";

@Component({
    selector: "app-share-access",
    templateUrl: "./share-access.component.html",
    styleUrls: ["./share-access.component.scss"],
})
export class ShareAccessComponent implements OnInit {
    submitForm: FormGroup;
    publicShareResponse: PublicShareResponseViewModel;
    shareId: string | null = null;
    hash: string | null = null;
    showLoadingSpinner: boolean = false;
    showSubmitSpinner: boolean = false;
    hasApiError: boolean = false;
    publicShareRequestViewModel: PublicShareRequestViewModel;
    accessCode: string;

    debug: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private shareAccessService: ShareAccessService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.shareId = params.get("shareid");
        });

        this.route.queryParamMap.subscribe(params => {
            this.hash = params.get("hash");
        });

        // define form
        this.submitForm = this.formBuilder.group({
            hash: this.hash,
            code: [null, Validators.compose([Validators.required])],
        } as AbstractControlOptions);

        this.getData();
    }

    getData() {
        if (this.debug) console.log("ShareAccessComponent getData");

        this.showLoadingSpinner = true;
        this.shareAccessService.getShareAccesss(this.shareId, this.hash).subscribe(data => {
            if (this.debug) console.log("ShareAccessComponent getData data", data);
            if (data.statusCode == 200) {
                this.publicShareResponse = (<ApiOkResult<PublicShareResponseViewModel>>data).result;
            } else {
                this.hasApiError = true;
            }
            this.showLoadingSpinner = false;
        });
    }

    handleSubmit() {
        if (this.debug) console.log("ShareAccessComponent handleSubmit", this.submitForm.value);

        if (this.submitForm.valid) {
            this.showSubmitSpinner = true;
            let publicShareRequestViewModel: PublicShareRequestViewModel = { ...this.submitForm.value };

            console.log(publicShareRequestViewModel);

            return this.shareAccessService.getShareDetails(this.shareId, publicShareRequestViewModel).subscribe(
                (data: ApiResponse) => {
                    if (this.debug) console.log("PublicShareRequestViewModel handleSubmit", data);
                    if (data.statusCode == 200) {
                        this.router.navigate([`/public/shares/${this.shareId}/details`], {
                            queryParams: { hash: this.hash, code: publicShareRequestViewModel.code },
                        });
                    } else {
                        this.submitForm.controls["code"].setErrors({
                            customError:
                                "Code invalid. Please enter the code provided in the email used to access this link.",
                        });
                    }
                    this.showSubmitSpinner = false;
                },
                error => {
                    if (this.debug) console.log("PublicShareRequestViewModel handleSubmit", error);
                    this.showSubmitSpinner = false;
                }
            );
        } else {
            this.submitForm.markAllAsTouched();
        }
    }

    hasError(field: string, errorCode: string | null = null): boolean {
        // NOTE: called too frequently for debug
        const formControl = this.submitForm.get(field);

        if (!formControl || !formControl.errors || !formControl.touched) {
            return false;
        }

        return errorCode != null ? formControl?.hasError(errorCode) : !formControl?.valid;
    }
}
