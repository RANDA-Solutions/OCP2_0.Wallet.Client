import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { UtilsService } from "@core/services/utils.service";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { CredentialCardResponseViewModel } from "../../services/credentialCardResponseViewModel";
import { CredentialService } from "../../services/credentials.service";
import { PublicShareRequestViewModel } from "../../services/publicShareRequestViewModel";
import { PublicEvidencePopupComponent } from "../evidence-popup/evidence-popup.component";
import { RevocationResponseModel } from "@shared/models/revocationResponseModel";
import { RevocationService } from "@core/services/revocation.service";
import { faShieldCheck, faBan, faExclamationCircle, faInfoCircle, faFile } from "@fortawesome/pro-solid-svg-icons";
@Component({
    selector: "[public-credential-card]",
    templateUrl: "./credential-card.component.html",
    styleUrls: ["./credential-card.component.scss"],
})
export class PublicCredentialCardComponent implements OnInit {
    faShieldCheck = faShieldCheck;
    faBan = faBan;
    faExclamationCircle = faExclamationCircle;
    faInfoCircle = faInfoCircle;
    faFile = faFile;
    @Input() verifiableCredentialId: number;
    @Input() shareId: number;
    @Input() hash: string;
    @Input() code: string;
    @Output() onDelete = new EventEmitter<CredentialCardResponseViewModel>();
    @Output() onSelect = new EventEmitter<{ credential: CredentialCardResponseViewModel; selected: boolean }>();

    credential: CredentialCardResponseViewModel = new CredentialCardResponseViewModel();
    credentialSpinner = false;
    documentSpinner = false;
    showAlignmentDetails = false;
    private debug = false;

    constructor(
        private modalService: NgbModal,
        private utilService: UtilsService,
        private credentialService: CredentialService,
        private revocationService: RevocationService
    ) {}

    ngOnInit() {
        if (this.debug) console.log("CredentialCardComponent ngOnInit", this.verifiableCredentialId);

        if (this.verifiableCredentialId > 0) this.getData();
    }

    formatDateToLocal(dt: Date) {
        return this.utilService.formatDateToLocal(dt);
    }

    getData() {
        this.credentialSpinner = true;

        let publicShareRequestViewModel: PublicShareRequestViewModel = {
            hash: this.hash,
            code: this.code,
        };

        if (this.debug) console.log("CredentialCardComponent getData", this.verifiableCredentialId);
        this.credentialService
            .getCard(this.verifiableCredentialId, this.shareId, publicShareRequestViewModel)
            .subscribe(data => {
                if (data.statusCode == 200) {
                    this.credential = (<ApiOkResult<CredentialCardResponseViewModel>>data).result;
                } else {
                    this.credential = new CredentialCardResponseViewModel();
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

    async viewDocument(verifiableCredential: CredentialCardResponseViewModel) {
        if (this.debug) console.log("CredentialCardComponent viewDocument", verifiableCredential);

        let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: true,
            centered: true,
            ariaLabelledBy: "modal-basic-title",
        };

        const modalRef = this.modalService.open(PublicEvidencePopupComponent, ngbModalOptions);
        modalRef.componentInstance.verifiableCredentialName = verifiableCredential.name;
        modalRef.componentInstance.verifiableCredentialId = verifiableCredential.verifiableCredentialId;

        modalRef.componentInstance.publicShareInfo = { shareId: this.shareId, hash: this.hash, code: this.code };
    }

    toggleAlignmentDetails() {
        this.showAlignmentDetails = !this.showAlignmentDetails;
    }

    isDateInThePast(date: Date): boolean {
        const currentDate = new Date();
        const givenDate = new Date(date);
        return givenDate < currentDate;
    }
}
