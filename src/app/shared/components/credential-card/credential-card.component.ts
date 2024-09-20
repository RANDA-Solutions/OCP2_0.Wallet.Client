import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CredentialCardResponseModel } from "./credentialCardResponseModel";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { UtilsService } from "@core/services/utils.service";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { EvidencePopupComponent } from "../evidence-popup/evidence-popup.component";
import { CredentialService } from "@core/services/credentials.service";
import { Router } from "@angular/router";
import { ShareCredentialsRequestModel } from "@modules/shares/pages/share-select-credentials/shareCredentialsRequestModel";
import { ListItem } from "@shared/models/listItem";
import { RevocationResponseModel } from "@shared/models/revocationResponseModel";
import { RevocationService } from "@core/services/revocation.service";
import { faBan, faExclamationCircle, faFile, faInfoCircle, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faShieldCheck } from "@fortawesome/pro-solid-svg-icons";

@Component({
    selector: "[app-credential-card]",
    templateUrl: "./credential-card.component.html",
    styleUrls: ["./credential-card.component.scss"],
})
export class CredentialCardComponent implements OnInit {
    faShare = faShare;
    faTrash = faTrash;
    faShieldCheck = faShieldCheck;
    faExclamationCircle = faExclamationCircle;
    faInfoCircle = faInfoCircle;
    faBan = faBan;
    faFile = faFile;
    @Input() verifiableCredentialId: number;
    @Input() showSelect: boolean = false;
    @Input() selected: boolean = false;
    @Input() showDelete: boolean;
    @Output() onDelete = new EventEmitter<CredentialCardResponseModel>();
    @Output() onSelect = new EventEmitter<{ credential: CredentialCardResponseModel; selected: boolean }>();

    credential: CredentialCardResponseModel = new CredentialCardResponseModel();
    credentialSpinner = false;
    documentSpinner = false;
    showAlignmentDetails = false;
    private debug = false;

    constructor(
        private modalService: NgbModal,
        private utilService: UtilsService,
        private router: Router,
        private credentialService: CredentialService,
        private revocationService: RevocationService
    ) {}

    ngOnInit() {
        if (this.debug) console.log("CredentialCardComponent ngOnInit", this.verifiableCredentialId, this.selected);

        if (this.verifiableCredentialId > 0) this.getData();
    }

    formatDateToLocal(dt: Date) {
        return this.utilService.formatDateToLocal(dt);
    }

    toggleCardSelected() {
        if (this.debug) console.log("CredentialCardComponent toggleCardSelected", this.selected);
        this.selected = !this.selected;

        const credential = { ...this.credential };
        this.onSelect.emit({ credential, selected: this.selected });
    }

    getData() {
        this.credentialSpinner = true;
        if (this.debug) console.log("CredentialCardComponent getData", this.verifiableCredentialId);
        this.credentialService.getCard(this.verifiableCredentialId).subscribe(data => {
            if (data.statusCode == 200) {
                this.credential = (<ApiOkResult<CredentialCardResponseModel>>data).result;
            } else {
                this.credential = new CredentialCardResponseModel();
            }
            this.credentialSpinner = false;

            if (!this.credential.isRevoked) {
                this.revocationService.getRevocation(this.verifiableCredentialId).subscribe(data => {
                    if (data.statusCode == 200) {
                        const { isRevoked, revokedReason } = (<ApiOkResult<RevocationResponseModel>>data).result;
                        this.credential = { ...this.credential, isRevoked, revokedReason };
                    }
                });
            }
        });
    }

    async viewDocument(verifiableCredential: CredentialCardResponseModel) {
        if (this.debug) console.log("CredentialCardComponent viewDocument", verifiableCredential);

        let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: true,
            centered: true,
            ariaLabelledBy: "modal-basic-title",
        };

        const modalRef = this.modalService.open(EvidencePopupComponent, ngbModalOptions);
        modalRef.componentInstance.verifiableCredentialName = verifiableCredential.name;
        modalRef.componentInstance.verifiableCredentialId = verifiableCredential.verifiableCredentialId;
    }

    toggleAlignmentDetails() {
        this.showAlignmentDetails = !this.showAlignmentDetails;
    }

    handleDelete() {
        if (this.debug) console.log("CredentialCardComponent handleDelete", this.credential);

        const credential = { ...this.credential };
        this.onDelete.emit(credential);
    }
    isDateInThePast(date: Date): boolean {
        const currentDate = new Date();
        const givenDate = new Date(date);
        return givenDate < currentDate;
    }

    shareCredential(id: number, name: string) {
        const shareCredentialsRequest = new ShareCredentialsRequestModel();
        // Creating a ListItem object with both id and name
        const listItem: ListItem = { id, name };

        shareCredentialsRequest.verifiableCredentialItems = [listItem];

        this.router.navigate(["/shares/select-credentials"], {
            state: {
                verifiableCredentialIds: shareCredentialsRequest.verifiableCredentialItems.map(sc => sc),
            },
        });
    }
}
