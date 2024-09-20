import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from "@angular/core";
import { PackageSearchResponseModel } from "@shared/models/packageSearchResponseModel";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-package-delete-popup",
    templateUrl: "./package-delete-popup.component.html",
    styleUrls: ["./package-delete-popup.component.scss"],
})
export class PackageDeletePopupComponent implements OnInit, OnDestroy {
    faTimes = faTimes;
    @Input() packageSearchResponseToDelete: PackageSearchResponseModel;
    @Output() onDelete: EventEmitter<PackageSearchResponseModel> = new EventEmitter();
    private debug = false;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {
        if (this.debug) console.log("PackageDeletePopupComponent ngOnInit", this.packageSearchResponseToDelete);
    }

    ngOnDestroy(): void {}

    handleCancel() {
        if (this.debug) console.log("PackageDeletePopupComponent handleCancel", this.packageSearchResponseToDelete);
        this.activeModal.close();
    }

    handleDelete() {
        if (this.debug) console.log("PackageDeletePopupComponent handleDelete", this.packageSearchResponseToDelete);

        const newPackage = { ...this.packageSearchResponseToDelete };
        this.onDelete.emit(newPackage);
    }
}
