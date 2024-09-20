import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CollectionService } from "@core/services/collection.service";
import { UtilsService } from "@core/services/utils.service";
import { CredentialCollectionAddEditRequestResponseModel } from "@shared/models/credentialCollectionAddEditRequestResponseModel";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { CollectionDeletePopupComponent } from "@shared/components/collection-delete-popup/collection-delete-popup.component";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "primeng/api";
import { faShare, faTrash } from "@fortawesome/free-solid-svg-icons";

@Component({
    templateUrl: "./collection-details.component.html",
    styleUrls: ["./collection-details.component.scss"],
})
export class CollectionDetailsComponent implements OnInit {
    faShare = faShare;
    faTrash = faTrash;
    collection: CredentialCollectionAddEditRequestResponseModel = new CredentialCollectionAddEditRequestResponseModel();
    collectionSpinner = false;
    deleteSpinner = false;
    modelErrors = new Array<string>();
    message = "loading collection";
    private debug = false;

    constructor(
        private route: ActivatedRoute,
        private collectionService: CollectionService,
        private utilService: UtilsService,
        private modalService: NgbModal,
        private messageService: MessageService,
        private router: Router,
        @Inject(DOCUMENT) private document: any
    ) {}

    ngOnInit() {
        if (this.debug) console.log("CollectionDetailsComponent ngOnInit");

        let collectionId = 0;
        this.route.paramMap.subscribe(params => {
            if (this.debug) console.log("CollectionDetailsComponent ngOnInit params", params);
            const collectionIdString = params.get("id");
            if (collectionIdString && !isNaN(+collectionIdString)) {
                collectionId = +collectionIdString;
                if (this.debug) console.log("CollectionDetailsComponent ngOnInit collectionId", collectionId);
            } else {
                this.router.navigate(["public/404"]);
            }
        });

        if (collectionId > 0) this.getData(collectionId);
    }

    getData(collectionId: number): any {
        this.collectionSpinner = true;
        if (this.debug) console.log("CollectionDetailsComponent getData", collectionId);
        this.collectionService.get(collectionId).subscribe(data => {
            if (data.statusCode == 200) {
                this.collection = (<ApiOkResult<CredentialCollectionAddEditRequestResponseModel>>data).result;
            } else if (data.statusCode == 404) {
                this.router.navigate(["public/404"]);
            } else {
                this.collection = new CredentialCollectionAddEditRequestResponseModel();
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.collectionSpinner = false;
        });
    }

    formatDateToLocal(dt: Date) {
        return this.utilService.formatDateToLocal(dt);
    }

    handleShowDelete(credentialCollectionToDelete: any) {
        if (this.debug) console.log("CollectionDetailsComponent handleShowDelete", credentialCollectionToDelete);
        const credentialCollection = <CredentialCollectionAddEditRequestResponseModel>credentialCollectionToDelete;

        let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: true,
            centered: true,
            ariaLabelledBy: "modal-basic-title",
        };

        const modalRef = this.modalService.open(CollectionDeletePopupComponent, ngbModalOptions);
        modalRef.componentInstance.collectionToDelete = credentialCollection;
        modalRef.componentInstance.onDelete.subscribe(
            (credentialCollection: CredentialCollectionAddEditRequestResponseModel) => {
                this.handleDelete(credentialCollection);
                modalRef.close();
            }
        );
    }

    handleDelete(credentialCollectionCard: CredentialCollectionAddEditRequestResponseModel) {
        this.deleteSpinner = true;
        if (this.debug) console.log("CollectionDetailsComponent handleDelete", credentialCollectionCard);
        this.collectionService.delete(credentialCollectionCard.credentialCollectionId).subscribe(response => {
            if (this.debug) console.log("CollectionDetailsComponent handleDelete data", response);
            if (response.status == 204) {
                this.messageService.add({
                    key: "main",
                    severity: "success",
                    summary: "Collection Deleted",
                    detail: `${credentialCollectionCard.name} was successfully removed.`,
                });
                this.router.navigate([`/collections`]);
            }
            this.deleteSpinner = false;
        });
    }

    shareCollection(id: number) {
        this.router.navigate(["/shares/select-collections"], {
            state: {
                collectionId: id,
            },
        });
    }
}
