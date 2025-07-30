import { Component, Input } from "@angular/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "app-credential-association-popup",
    templateUrl: "./credential-association-popup.component.html",
    styleUrls: ["./credential-association-popup.component.scss"],
})
export class CredentialAssociationPopupComponent {
    faTimes = faTimes;
    @Input() credentialId: number;
    @Input() credentialName: string;

    constructor(public activeModal: NgbActiveModal) {}

    handleClose() {
        this.activeModal.close();
    }

}
