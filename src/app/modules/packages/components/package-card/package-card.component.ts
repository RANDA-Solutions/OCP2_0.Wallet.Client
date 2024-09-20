import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { PackageSearchResponseModel } from "../../../../shared/models/packageSearchResponseModel";
import { ShareCredentialsRequestModel } from "@modules/shares/pages/share-select-credentials/shareCredentialsRequestModel";
import { Router } from "@angular/router";
import { RevocationService } from "@core/services/revocation.service";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { RevocationResponseModel } from "@shared/models/revocationResponseModel";
import { faExclamationCircle, faShare, faBan } from "@fortawesome/free-solid-svg-icons";
import { faShieldCheck } from "@fortawesome/pro-solid-svg-icons";

@Component({
    selector: "[app-package-card]",
    styleUrls: ["./package-card.component.scss"],
    templateUrl: "./package-card.component.html",
})
export class PackageCardComponent implements OnChanges, OnDestroy, OnInit {
    faShare = faShare;
    faShieldCheck = faShieldCheck;
    faExclamationCircle = faExclamationCircle;
    faBan = faBan;
    @Input() package: PackageSearchResponseModel;
    showSpinner = false;
    private debug = false;
    constructor(
        private utilService: UtilsService,
        private router: Router,
        private revocationService: RevocationService
    ) {}
    ngOnChanges() {
        if (this.debug) console.log("PackageCardComponent ngOnChanges", this.package);
    }
    ngOnInit() {
        if (this.debug) console.log("PackageCardComponent ngOnInit", this.package);

        if (!this.package.isRevoked) {
            this.revocationService.getRevocation(this.package.verifiableCredentialId).subscribe(data => {
                if (data.statusCode == 200) {
                    const { isRevoked, revokedReason } = (<ApiOkResult<RevocationResponseModel>>data).result;
                    this.package = { ...this.package, isRevoked, revokedReason };
                }
            });
        }
    }

    formatDateToLocal(dt: Date) {
        return this.utilService.formatDateToLocal(dt);
    }

    ngOnDestroy(): void {}

    sharePackage(id: number) {
        this.router.navigate(["/shares/select-credentials"], {
            state: {
                packageId: id,
            },
        });
    }
}
