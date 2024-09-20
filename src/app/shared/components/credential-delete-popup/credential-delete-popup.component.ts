import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CredentialCardResponseModel } from "../credential-card/credentialCardResponseModel";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-credential-delete-popup",
    templateUrl: "./credential-delete-popup.component.html",
    styleUrls: ["./credential-delete-popup.component.scss"],
})
export class CredentialDeletePopupComponent implements OnInit, OnDestroy {
    faTimes = faTimes;
    @Input() credentialToDelete: CredentialCardResponseModel;
    @Output() onDelete: EventEmitter<CredentialCardResponseModel> = new EventEmitter();
    private debug = false;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
        if (this.debug) console.log("CredentialDeletePopupComponent ngOnInit", this.credentialToDelete);
    }

    ngOnDestroy(): void {}

    handleCancel() {
        if (this.debug) console.log("CredentialDeletePopupComponent handleCancel", this.credentialToDelete);
        this.activeModal.close();
    }

    handleDelete() {
        if (this.debug) console.log("CredentialDeletePopupComponent handleDelete", this.credentialToDelete);

        const credential = { ...this.credentialToDelete };
        this.onDelete.emit(credential);
    }
}
