import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from "@angular/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CredentialCollectionCardResponseModel } from "@shared/models/credentialCollectionCardResponseModel";

@Component({
    selector: "app-collection-delete-popup",
    templateUrl: "./collection-delete-popup.component.html",
    styleUrls: ["./collection-delete-popup.component.scss"],
})
export class CollectionDeletePopupComponent implements OnInit, OnDestroy {
    faTimes = faTimes;
    @Input() collectionToDelete: CredentialCollectionCardResponseModel;
    @Output() onDelete: EventEmitter<CredentialCollectionCardResponseModel> = new EventEmitter();
    private debug = false;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
        if (this.debug) console.log("CollectionDeletePopupComponent ngOnInit", this.collectionToDelete);
    }

    ngOnDestroy(): void {}

    handleCancel() {
        if (this.debug) console.log("CollectionDeletePopupComponent handleCancel", this.collectionToDelete);
        this.activeModal.close();
    }

    handleDelete() {
        if (this.debug) console.log("CollectionDeletePopupComponent handleDelete", this.collectionToDelete);

        const collection = { ...this.collectionToDelete };
        this.onDelete.emit(collection);
    }
}
