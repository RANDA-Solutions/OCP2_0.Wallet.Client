import { DOCUMENT } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { CredentialCollectionsSearchRequestModel } from "@shared/models/credentialCollectionsSearchRequestModel";
import { debounceTime } from "rxjs/operators";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CollectionService } from "@core/services/collection.service";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
    templateUrl: "./collection-search.component.html",
    styleUrls: ["./collection-search.component.scss"],
})
export class CollectionSearchComponent {
    faSearch = faSearch;
    credentialCollectionIds: number[] = new Array<number>();
    activeModal: NgbActiveModal;
    searchForm: FormGroup;
    modelErrors = new Array<string>();
    showSpinner = false;

    private debug = false;

    constructor(
        private formBuilder: FormBuilder,
        private collectionService: CollectionService,
        @Inject(DOCUMENT) private document: any
    ) {}

    async ngOnInit() {
        if (this.debug) console.log("CollectionSearchComponent ngOnInit");

        this.searchForm = this.formBuilder.group(this.createFormGroup(new CredentialCollectionsSearchRequestModel()));

        // load our initial results
        this.getData(this.searchForm.value);

        // hookup for changes
        this.onChanges();
    }

    ngOnDestroy(): void {}

    createFormGroup(model: CredentialCollectionsSearchRequestModel): { [key: string]: FormControl } {
        if (this.debug) console.log("CollectionSearchComponent createFormGroup", model);
        const group: { [key: string]: FormControl } = {};
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                group[key] = new FormControl((model as any)[key]);
            }
        }
        return group;
    }

    onChanges(): void {
        if (this.debug) console.log("CollectionSearchComponent onChanges");
        this.searchForm.valueChanges
            .pipe(debounceTime(300)) // wait 300ms after the last event before emitting last event
            .subscribe((val: CredentialCollectionsSearchRequestModel) => {
                if (this.debug) console.log("CollectionSearchComponent onChanges val", val);
                this.getData(val);
            });
    }

    getData(collectionsSearchRequest: CredentialCollectionsSearchRequestModel): any {
        this.showSpinner = true;
        if (this.debug) console.log("CollectionSearchComponent getData", collectionsSearchRequest);
        this.collectionService.search(collectionsSearchRequest).subscribe(data => {
            if (this.debug) console.log("CollectionSearchComponent getData data", data);
            if (data.statusCode == 200) {
                this.credentialCollectionIds = (<ApiOkResult<number[]>>data).result;
            } else {
                this.credentialCollectionIds = new Array<number>();
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.showSpinner = false;
        });
    }

    // Helper method to set form control values
    setFormControlValue<K extends keyof CredentialCollectionsSearchRequestModel>(
        control: K,
        value: CredentialCollectionsSearchRequestModel[K]
    ): void {
        if (this.debug) console.log("CollectionSearchComponent setFormControlValue", control, value);

        (this.searchForm.get(control) as FormControl).setValue(value);
    }

    // Helper method to get form control values
    getFormControlValue<K extends keyof CredentialCollectionsSearchRequestModel>(
        control: K
    ): CredentialCollectionsSearchRequestModel[K] | null {
        if (this.debug) console.log("CollectionSearchComponent getFormControlValue", control);

        return this.searchForm.get(control)?.value ?? null;
    }
    s;
}
