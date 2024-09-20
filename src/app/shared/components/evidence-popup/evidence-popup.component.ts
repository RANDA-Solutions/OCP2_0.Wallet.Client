import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EvidenceService } from "../evidence-popup/evidence.service";
import { EvidenceViewModel } from "@shared/models/evidenceViewModel";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-evidence-popup",
    templateUrl: "./evidence-popup.component.html",
    styleUrls: ["./evidence-popup.component.scss"],
})
export class EvidencePopupComponent implements OnInit {
    faTimes = faTimes;
    @Input() verifiableCredentialName: string = "";
    @Input() verifiableCredentialId: number;
    showSpinner = false;
    evidences = new Array<EvidenceViewModel>();
    private debug = false;
    modelErrors = new Array<string>();
    constructor(
        public activeModal: NgbActiveModal,
        private evidenceService: EvidenceService
    ) {}

    ngOnInit() {
        this.showSpinner = true;

        if (this.debug) console.log("ngOnInit evidence modal");
        //need to make a call to get evidence
        this.getEvidenceData();
    }

    ngOnDestroy(): void {}

    close(res: string) {
        this.activeModal.close();
    }

    openfile(evidence: EvidenceViewModel) {
        const fileUrl = evidence.evidenceUrl;
        const mimeType = fileUrl.split(",")[0].match(/:(.*?);/)[1];
        const base64Data = fileUrl.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        // Open the Blob URL in a new tab
        const newWindow = window.open(blobUrl, "_blank");
        if (newWindow) {
            newWindow.focus();
        } else {
            console.log("Failed to open PDF. Please check your popup blocker.");
        }
    }

    getEvidenceData() {
        // Make the API call to get evidences
        this.evidenceService.getEvidences(this.verifiableCredentialId).subscribe(data => {
            if (this.debug) console.log("getEvidenceData", data);

            if (data.statusCode == 200) {
                this.evidences = (<ApiOkResult<EvidenceViewModel[]>>data).result;
                if (this.evidences.length === 1) {
                    this.openfile(this.evidences[0]);
                    this.close("one file");
                }
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.showSpinner = false;
        });
    }
}
