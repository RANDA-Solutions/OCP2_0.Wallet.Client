import { DOCUMENT } from "@angular/common";
import { Component, Inject, Input, OnChanges, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilsService } from "@core/services/utils.service";
import { PackageService } from "@core/services/package.service";
import { PackageDetailsResponseModel } from "@shared/models/packageDetailsResponseModel";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { CredentialCardResponseModel } from "@shared/components/credential-card/credentialCardResponseModel";
import { CredentialDeletePopupComponent } from "@shared/components/credential-delete-popup/credential-delete-popup.component";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResponse, ApiOkResult } from "@shared/models/apiOkResponse";
import { MessageService } from "primeng/api";
import { CredentialService } from "@core/services/credentials.service";
import { PackageDeletePopupComponent } from "@modules/packages/components/package-delete-popup/package-delete-popup.component";
import { RevocationService } from "@core/services/revocation.service";
import { RevocationResponseModel } from "@shared/models/revocationResponseModel";
import { faShare, faTrash, faExclamationCircle, faBan } from "@fortawesome/free-solid-svg-icons";
import { faShieldCheck } from "@fortawesome/pro-solid-svg-icons";

@UntilDestroy()
@Component({
    templateUrl: "./package-details.component.html",
    styleUrls: ["./package-details.component.scss"],
})
export class PackageDetailsComponent implements OnInit {
    faTrash = faTrash;
    faShare = faShare;
    faShieldCheck = faShieldCheck;
    faExclamationCircle = faExclamationCircle;
    faBan = faBan;
    package: PackageDetailsResponseModel = new PackageDetailsResponseModel();
    packageSpinner = false;
    showPackageDeleteSpinner = false;
    modelErrors = new Array<string>();
    message = "loading credentials";
    private debug = false;

    constructor(
        private route: ActivatedRoute,
        private packageService: PackageService,
        private credentialService: CredentialService,
        private utilService: UtilsService,
        private modalService: NgbModal,
        private messageService: MessageService,
        private router: Router,
        private revocationService: RevocationService,
        @Inject(DOCUMENT) private document: any
    ) {}

    ngOnInit() {
        if (this.debug) console.log("PackageDetailsComponent ngOnInit");

        let packageId = 0;
        this.route.paramMap.subscribe(params => {
            if (this.debug) console.log("PackageDetailsComponent ngOnInit params", params);
            const packageIdString = params.get("id");
            if (packageIdString && !isNaN(+packageIdString)) {
                packageId = +packageIdString;
                if (this.debug) console.log("PackageDetailsComponent ngOnInit packageId", packageId);

                this.getData(packageId);
            } else {
                this.router.navigate(["public/404"]);
            }
        });
    }

    getData(packageId: number): any {
        this.packageSpinner = true;
        if (this.debug) console.log("PackageDetailsComponent getData", packageId);
        this.packageService.get(packageId).subscribe(data => {
            if (data.statusCode == 200) {
                this.package = (<ApiOkResult<PackageDetailsResponseModel>>data).result;
            } else if (data.statusCode == 404) {
                this.router.navigate(["public/404"]);
            } else {
                this.package = new PackageDetailsResponseModel();
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.packageSpinner = false;

            if (!this.package.isRevoked) {
                this.revocationService.getRevocation(this.package.verifiableCredentialId).subscribe(data => {
                    if (data.statusCode == 200) {
                        const { isRevoked, revokedReason } = (<ApiOkResult<RevocationResponseModel>>data).result;
                        this.package = { ...this.package, isRevoked, revokedReason };
                    }
                });
            }
        });
    }

    formatDateToLocal(dt: Date) {
        return this.utilService.formatDateToLocal(dt);
    }

    handleShowPackageDelete(packageDetailsResponseToDelete: any) {
        if (this.debug) console.log("PackageDetailsComponent handleShowPackageDelete", packageDetailsResponseToDelete);

        let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: true,
            centered: true,
            ariaLabelledBy: "modal-basic-title",
        };

        const modalRef = this.modalService.open(PackageDeletePopupComponent, ngbModalOptions);
        modalRef.componentInstance.packageSearchResponseToDelete = <PackageDetailsResponseModel>(
            packageDetailsResponseToDelete
        );
        modalRef.componentInstance.onDelete.subscribe((packageSearchResponse: PackageDetailsResponseModel) => {
            this.handlePackageDelete(packageSearchResponse);
            modalRef.close();
        });
    }

    handlePackageDelete(packageDetailsResponse: PackageDetailsResponseModel) {
        this.showPackageDeleteSpinner = true;
        if (this.debug) console.log("PackageDetailsComponent handlePackageDelete", packageDetailsResponse);
        this.packageService.delete(packageDetailsResponse.credentialPackageId).subscribe(response => {
            if (this.debug) console.log("PackageDetailsComponent handlePackageDelete data", response);
            if (response.status == 204) {
                this.messageService.add({
                    key: "main",
                    severity: "success",
                    summary: "Credentials Deleted",
                    detail: `${packageDetailsResponse.name} was successfully removed.`,
                });
                //redirect to package search
                this.router.navigate([`/packages`]);
            }
            this.showPackageDeleteSpinner = false;
        });
    }

    handleShowDeleteCredential(credentialToDelete: any) {
        if (this.debug) console.log("PackageDetailsComponent handleShowDeleteCredential", credentialToDelete);
        const credential = <CredentialCardResponseModel>credentialToDelete;

        let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: true,
            centered: true,
            ariaLabelledBy: "modal-basic-title",
        };

        const modalRef = this.modalService.open(CredentialDeletePopupComponent, ngbModalOptions);
        modalRef.componentInstance.credentialToDelete = credential;
        modalRef.componentInstance.onDelete.subscribe((credential: CredentialCardResponseModel) => {
            this.handleDeleteCredential(credential);
            modalRef.close();
        });
    }

    handleDeleteCredential(credentialCard: CredentialCardResponseModel) {
        if (this.debug) console.log("PackageDetailsComponent handleDeleteCredential", credentialCard);
        this.credentialService.delete(credentialCard.verifiableCredentialId).subscribe(response => {
            if (this.debug) console.log("PackageDetailsComponent handleDeleteCredential", response);
            if (response.status == 204) {
                // remove from results on success
                this.package.verifiableCredentialIds = this.package.verifiableCredentialIds.filter(
                    csr => csr != credentialCard.verifiableCredentialId
                );
                if(this.package.verifiableCredentialIds.length < 1)
                {
                    this.router.navigate(["/packages"]);
                }
                this.messageService.add({
                    key: "main",
                    severity: "success",
                    summary: "Credential Deleted",
                    detail: `${credentialCard.name} was successfully removed.`,
                });
            }
        });
    }

    sharePackage(id: number) {
        this.router.navigate(["/shares/select-credentials"], {
            state: {
                packageId: id,
            },
        });
    }
}
