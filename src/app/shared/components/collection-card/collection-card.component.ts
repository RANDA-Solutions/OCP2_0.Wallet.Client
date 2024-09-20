import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CollectionService } from "@core/services/collection.service";
import { UtilsService } from "@core/services/utils.service";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { CredentialCollectionCardResponseModel } from "@shared/models/credentialCollectionCardResponseModel";

@Component({
    selector: "[app-credential-collection-card]",
    templateUrl: "./collection-card.component.html",
    styleUrls: ["./collection-card.component.scss"],
})
export class CollectionCardComponent implements OnInit {
    @Input() credentialCollectionId: number;
    @Input() showSelect: boolean = false;
    @Input() selected: boolean = false;
    @Output() onSelect = new EventEmitter<{
        collection: CredentialCollectionCardResponseModel;
        selected: boolean;
    }>();

    collection: CredentialCollectionCardResponseModel;
    showSpinner = false;
    private debug = false;
    constructor(
        private utilService: UtilsService,
        private collectionService: CollectionService,
        private router: Router
    ) {}

    ngOnInit() {
        if (this.debug) console.log("CollectionCardComponent ngOnInit", this.credentialCollectionId);

        if (this.credentialCollectionId > 0) this.getData();
    }

    formatDateToLocal(dt: Date) {
        return this.utilService.formatDateToLocal(dt);
    }

    toggleCardSelected() {
        if (this.debug) console.log("CollectionCardComponent toggleCardSelected", this.selected);
        this.selected = !this.selected;

        const collection = { ...this.collection };
        this.onSelect.emit({ collection, selected: this.selected });
    }

    getData() {
        this.showSpinner = true;
        if (this.debug) console.log("CollectionCardComponent getData", this.credentialCollectionId);
        this.collectionService.getCard(this.credentialCollectionId).subscribe(data => {
            if (data.statusCode == 200) {
                this.collection = (<ApiOkResult<CredentialCollectionCardResponseModel>>data).result;
            } else {
                this.collection = new CredentialCollectionCardResponseModel();
            }
            this.showSpinner = false;
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
