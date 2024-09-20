import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
    AbstractControl,
    AbstractControlOptions,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
} from "@angular/forms";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { debounceTime } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomValidators } from "../share-select-collections/custom-validators";
import { CredentialCollectionsSearchRequestModel } from "@shared/models/credentialCollectionsSearchRequestModel";
import { ShareCollectionsRequestModel } from "./shareCollectionsRequestModel";
import { CollectionService } from "@core/services/collection.service";
import { CredentialCollectionCardResponseModel } from "@shared/models/credentialCollectionCardResponseModel";
import { ListItem } from "@shared/models/listItem";
import { CredentialCollectionAddEditRequestResponseModel } from "@shared/models/credentialCollectionAddEditRequestResponseModel";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
    templateUrl: "./share-select-collections.component.html",
    styleUrls: ["./share-select-collections.component.scss"],
})
export class ShareSelectCollectionsComponent implements OnInit {
    faTimes = faTimes;
    faSearch = faSearch;
    credentialCollectionIds: number[] = new Array<number>();
    addEditForm: FormGroup;
    searchForm: FormGroup;
    modelErrors = new Array<string>();
    searchSpinner = false;
    addOrEditSpinner = false;

    private debug = false;

    constructor(
        private route: ActivatedRoute,
        private collectionService: CollectionService,
        private router: Router,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any
    ) {}

    async ngOnInit() {
        if (this.debug) console.log("ShareSelectCollectionsComponent ngOnInit");

        this.addEditForm = this.formBuilder.group({
            credentialCollectionItems: this.formBuilder.array<ListItem>([], {
                validators: CustomValidators.atLeastOneItemValidator(),
            } as AbstractControlOptions),
        } as AbstractControlOptions);

        this.searchForm = this.formBuilder.group(
            this.createFormGroupForSearch(new CredentialCollectionsSearchRequestModel())
        );

        // check state for collectionId
        const collectionId = history.state.collectionId;

        if (collectionId) {
            this.getCredentialIdsByCollection(collectionId);
        }

        // load our initial results
        this.getAvailableCredentials(this.searchForm.value);

        // hookup for changes
        this.onChangesForSearch();
    }

    getCredentialIdsByCollection(collectionId: any): void {
        if (this.debug) console.log("getCredentialIdsByCollection getData", collectionId);

        this.collectionService.get(collectionId).subscribe(data => {
            if (data.statusCode == 200) {
                let CredentialCollectionAddEditRequestResponseModel = (<
                    ApiOkResult<CredentialCollectionAddEditRequestResponseModel>
                >data).result;

                //pull off verifiableCredentialId & name for sharing purposes
                const id = CredentialCollectionAddEditRequestResponseModel.credentialCollectionId;
                const name = CredentialCollectionAddEditRequestResponseModel.name;
                const shareCollectionRequest = new ShareCollectionsRequestModel();
                const listItem: ListItem[] = [];
                // Creating a ListItem object with both id and name
                const item: ListItem = { id, name };

                // Add the ListItem object to the listItem array
                listItem.push(item);

                shareCollectionRequest.credentialCollectionItems = listItem;
                this.patchValueForAdd(shareCollectionRequest.credentialCollectionItems);
                this.setCollectionSelected(item.id);
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
        });
    }

    createFormGroupForSearch(model: CredentialCollectionsSearchRequestModel): { [key: string]: FormControl } {
        if (this.debug) console.log("ShareSelectCollectionsComponent createFormGroupForSearch", model);
        const group: { [key: string]: FormControl } = {};
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                group[key] = new FormControl((model as any)[key]);
            }
        }
        return group;
    }

    onChangesForSearch(): void {
        if (this.debug) console.log("ShareSelectCollectionsComponent onChangesForSearch");
        this.searchForm.valueChanges
            .pipe(debounceTime(300)) // wait 300ms after the last event before emitting last event
            .subscribe((val: CredentialCollectionsSearchRequestModel) => {
                if (this.debug) console.log("ShareSelectCollectionsComponent onChanges val", val);
                this.getAvailableCredentials(val);
            });
    }

    getAvailableCredentials(credentialCollectionsSearchRequest: CredentialCollectionsSearchRequestModel): void {
        this.searchSpinner = true;
        if (this.debug)
            console.log("ShareSelectCollectionsComponent getAvailableCredentials", credentialCollectionsSearchRequest);
        this.collectionService.search(credentialCollectionsSearchRequest).subscribe(data => {
            if (this.debug) console.log("ShareSelectCollectionsComponent getAvailableCredentials data", data);
            if (data.statusCode == 200) {
                this.credentialCollectionIds = (<ApiOkResult<number[]>>data).result;
            } else {
                this.credentialCollectionIds = new Array<number>();
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.searchSpinner = false;
        });
    }

    resetFiltersForSearch(): void {
        if (this.debug) console.log("ShareSelectCollectionsComponent resetFiltersForSearch");

        this.searchForm.setValue(new CredentialCollectionsSearchRequestModel());
    }

    // Helper method to set form control values
    setFormControlValueForSearch<K extends keyof CredentialCollectionsSearchRequestModel>(
        control: K,
        value: CredentialCollectionsSearchRequestModel[K]
    ): void {
        // if (this.debug) console.log("ShareSelectCollectionsComponent setFormControlValueForSearch", control, value);

        (this.searchForm.get(control) as FormControl).setValue(value);
    }

    // Helper method to get form control values
    getFormControlValueForSearch<K extends keyof CredentialCollectionsSearchRequestModel>(
        control: K
    ): CredentialCollectionsSearchRequestModel[K] | null {
        // if (this.debug) console.log("ShareSelectCollectionsComponent getFormControlValueForSearch", control);

        return this.searchForm.get(control)?.value ?? null;
    }

    getFormArrayForAdd<K extends keyof ShareCollectionsRequestModel>(control: K): FormArray {
        // if (this.debug) console.log("ShareSelectCollectionsComponent getFormArrayForAdd", control);

        return this.addEditForm.get(control) as FormArray;
    }
    getFormArrayItemValueForAdd<K extends keyof ListItem>(item: AbstractControl<any, any>, control: K): any {
        // if (this.debug) console.log("ShareSelectCollectionsComponent getFormArrayItemForAdd", item, control);

        return item.get(control)?.value;
    }

    setCollectionSelected(credentialCollectionId: number): void {
        console.log("setCollectionSelected", credentialCollectionId);
        let items = this.getFormArrayForAdd("credentialCollectionItems");
        const itemIndex = items.controls.findIndex(
            control => this.getFormArrayItemValueForAdd(control, "id") === credentialCollectionId
        );
    }

    isCollectionSelected(credentialCollectionId: number): boolean {
        let items = this.getFormArrayForAdd("credentialCollectionItems");
        const itemIndex = items.controls.findIndex(
            control => this.getFormArrayItemValueForAdd(control, "id") === credentialCollectionId
        );
        // if (this.debug)
        //     console.log("ShareSelectCollectionsComponent isCredentialSelected", verifiableCredentialId, itemIndex);
        return itemIndex !== -1;
    }

    hasFiltersForSearch(): boolean {
        const credentialCollectionsSearchRequest = <CredentialCollectionsSearchRequestModel>this.searchForm.value;
        return !!credentialCollectionsSearchRequest.keywords || !!credentialCollectionsSearchRequest.sortBy;
    }

    handleSelectCollection(collectionEventData: any) {
        if (this.debug) console.log("ShareSelectCollectionsComponent handleSelectCollection", collectionEventData);
        const { collection, selected } = <{ collection: CredentialCollectionCardResponseModel; selected: boolean }>(
            collectionEventData
        );

        let items = this.getFormArrayForAdd("credentialCollectionItems");
        if (this.debug) console.log("ShareSelectCollectionsComponent handleSelectCollection items", items);

        if (selected) {
            const listItem: ListItem = {
                id: collection.credentialCollectionId,
                name: collection.name,
            };
            const itemGroup = this.formBuilder.group(listItem);
            items.push(itemGroup);

            if (this.debug) console.log("ShareSelectCollectionsComponent handleSelectCollection items push", itemGroup);
        } else {
            const itemIndex = items.controls.findIndex(
                control => control.get("id")?.value === collection.credentialCollectionId
            );
            if (itemIndex !== -1) {
                items.removeAt(itemIndex);
            }

            if (this.debug)
                console.log("ShareSelectCollectionsComponent handleSelectCollection items remove", itemIndex);
        }
        this.markFormArrayAsTouched(items);
    }

    markFormArrayAsTouched(formArray: FormArray): void {
        formArray.markAllAsTouched();
        formArray.controls.forEach(control => {
            if (control instanceof FormGroup) {
                Object.values(control.controls).forEach(ctrl => ctrl.markAsTouched());
            }
        });
    }

    handleRemoveCollection(index: number, credentialCollectionId: number) {
        if (this.debug)
            console.log("ShareSelectCollectionsComponent handleRemoveCredential", index, credentialCollectionId);

        let items = this.getFormArrayForAdd("credentialCollectionItems");
        if (this.debug) console.log("ShareSelectCollectionsComponent handleRemoveCredential items", items);

        items.removeAt(index);
        this.markFormArrayAsTouched(items);
    }

    hasErrorForAdd(field: string, errorCode: string | null = null): boolean {
        // NOTE: called too frequently for debug
        const formControl = this.addEditForm.get(field);

        if (!formControl || !formControl.errors || !formControl.touched) {
            return false;
        }

        return errorCode != null ? formControl?.hasError(errorCode) : !formControl?.valid;
    }

    handleSubmitForAdd() {
        if (this.debug) console.log("ShareSelectCollectionsComponent handleSubmitForAdd", this.addEditForm);

        if (this.addEditForm.valid) {
            this.addOrEditSpinner = true;
            const shareCollectionsRequest = <ShareCollectionsRequestModel>this.addEditForm.value;
            if (this.debug)
                console.log("ShareSelectCollectionsComponent handleSubmitForAdd form.value", shareCollectionsRequest);

            this.router.navigate(["/shares/add"], {
                state: {
                    credentialCollectionIds: shareCollectionsRequest.credentialCollectionItems.map(sc => sc.id),
                },
            });
        } else {
            this.addEditForm.markAllAsTouched();
        }
    }

    patchValueForAdd(data: ListItem[]): void {
        if (this.debug) console.log("ShareSelectCollectionsComponent patchValueForAdd", data);

        this.addEditForm.patchValue(data);

        if (data && data.length) {
            let items = this.getFormArrayForAdd("credentialCollectionItems");
            items.clear();
            data.forEach(listItem => {
                const itemGroup = this.formBuilder.group(listItem);
                items.push(itemGroup);
            });
        }
    }
}
