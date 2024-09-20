import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    FormControl,
    AbstractControlOptions,
    Validators,
    FormArray,
    AbstractControl,
} from "@angular/forms";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { CredentialSearchRequestModel } from "@shared/models/credentialSearchRequestModel";
import { CredentialsSearchResponseModel } from "@shared/models/credentialsSearchResponseModel";
import { debounceTime } from "rxjs/operators";
import { CredentialCollectionAddEditRequestResponseModel } from "@shared/models/credentialCollectionAddEditRequestResponseModel";
import { CredentialCardResponseModel } from "@shared/components/credential-card/credentialCardResponseModel";
import { CustomValidators } from "./custom-validators";
import { ActivatedRoute, Router } from "@angular/router";
import { CollectionService } from "@core/services/collection.service";
import { CredentialService } from "@core/services/credentials.service";
import { ListItem } from "@shared/models/listItem";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
    templateUrl: "./collection-add-edit.component.html",
    styleUrls: ["./collection-add-edit.component.scss"],
})
export class CollectionAddEditComponent implements OnInit {
    faSearch = faSearch;
    faTimes = faTimes;
    credentialsSearchResponse: CredentialsSearchResponseModel = new CredentialsSearchResponseModel();
    addEditForm: FormGroup;
    searchForm: FormGroup;
    modelErrors = new Array<string>();
    searchSpinner = false;
    addOrEditSpinner = false;

    private debug = false;

    constructor(
        private route: ActivatedRoute,
        private credentialService: CredentialService,
        private collectionService: CollectionService,
        private router: Router,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any
    ) {}

    async ngOnInit() {
        if (this.debug) console.log("CollectionAddEditComponent ngOnInit");

        this.addEditForm = this.formBuilder.group({
            credentialCollectionId: [null],
            name: [
                null,
                Validators.compose([CustomValidators.maxLengthConditionalValidator(100), Validators.required]),
            ],
            description: [
                null,
                Validators.compose([CustomValidators.maxLengthConditionalValidator(1000), Validators.required]),
            ],
            verifiableCredentialItems: this.formBuilder.array<ListItem>([], {
                validators: CustomValidators.atLeastOneItemValidator(),
            } as AbstractControlOptions),
        } as AbstractControlOptions);

        this.searchForm = this.formBuilder.group(this.createFormGroupForSearch(new CredentialSearchRequestModel()));

        // check for edit collection
        let collectionid = 0;
        this.route.paramMap.subscribe(params => {
            if (this.debug) console.log("CollectionAddEditComponent ngOnInit params", params);
            const collectionIdString = params.get("id");
            if (collectionIdString && !isNaN(+collectionIdString)) {
                collectionid = +collectionIdString;
                if (this.debug) console.log("CollectionAddEditComponent ngOnInit packageId", collectionid);

                // if we have a collection then load and initialize form with it
                this.getCollection(collectionid);
            } else if (!collectionIdString) {
                this.patchValueForAdd(new CredentialCollectionAddEditRequestResponseModel());
            } else {
                this.router.navigate(["public/404"]);
            }
        });

        // load our initial results
        this.getAvailableCredentials(this.searchForm.value);

        // hookup for changes
        this.onChangesForSearch();
    }

    createFormGroupForSearch(model: CredentialSearchRequestModel): { [key: string]: FormControl } {
        if (this.debug) console.log("CollectionAddEditComponent createFormGroupForSearch", model);
        const group: { [key: string]: FormControl } = {};
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                group[key] = new FormControl((model as any)[key]);
            }
        }
        return group;
    }

    onChangesForSearch(): void {
        if (this.debug) console.log("CollectionAddEditComponent onChangesForSearch");
        this.searchForm.valueChanges
            .pipe(debounceTime(300)) // wait 300ms after the last event before emitting last event
            .subscribe((val: CredentialSearchRequestModel) => {
                if (this.debug) console.log("CollectionAddEditComponent onChanges val", val);
                this.getAvailableCredentials(val);
            });
    }

    getAvailableCredentials(credentialsSearchRequest: CredentialSearchRequestModel): void {
        this.searchSpinner = true;
        if (this.debug) console.log("CollectionAddEditComponent getAvailableCredentials", credentialsSearchRequest);
        this.credentialService.search(credentialsSearchRequest).subscribe(data => {
            if (this.debug) console.log("CollectionAddEditComponent getAvailableCredentials data", data);
            if (data.statusCode == 200) {
                this.credentialsSearchResponse = (<ApiOkResult<CredentialsSearchResponseModel>>data).result;
            } else {
                this.credentialsSearchResponse = new CredentialsSearchResponseModel();
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.searchSpinner = false;
        });
    }

    getCollection(collectionId: number): void {
        if (this.debug) console.log("CollectionAddEditComponent getCollection", collectionId);
        this.collectionService.get(collectionId).subscribe(data => {
            if (this.debug) console.log("CollectionAddEditComponent getCollection data", data);
            if (data.statusCode == 200) {
                const collection = (<ApiOkResult<CredentialCollectionAddEditRequestResponseModel>>data).result;
                this.patchValueForAdd(collection);
            } else if (data.statusCode == 404) {
                this.router.navigate(["public/404"]);
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
        });
    }

    resetFiltersForSearch(): void {
        if (this.debug) console.log("CollectionAddEditComponent resetFiltersForSearch");

        this.searchForm.setValue(new CredentialSearchRequestModel());
    }

    // Helper method to set form control values
    setFormControlValueForSearch<K extends keyof CredentialSearchRequestModel>(
        control: K,
        value: CredentialSearchRequestModel[K]
    ): void {
        if (this.debug) console.log("CollectionAddEditComponent setFormControlValueForSearch", control, value);

        (this.searchForm.get(control) as FormControl).setValue(value);
    }

    // Helper method to get form control values
    getFormControlValueForSearch<K extends keyof CredentialSearchRequestModel>(
        control: K
    ): CredentialSearchRequestModel[K] | null {
        // if (this.debug) console.log("CollectionAddEditComponent getFormControlValueForSearch", control);

        return this.searchForm.get(control)?.value ?? null;
    }

    getFormArrayForAdd<K extends keyof CredentialCollectionAddEditRequestResponseModel>(control: K): FormArray {
        // if (this.debug) console.log("CollectionAddEditComponent getFormArrayForAdd", control);

        return this.addEditForm.get(control) as FormArray;
    }
    getFormArrayItemValueForAdd<K extends keyof ListItem>(item: AbstractControl<any, any>, control: K): any {
        // if (this.debug) console.log("CollectionAddEditComponent getFormArrayItemForAdd", item, control);

        return item.get(control)?.value;
    }

    isCredentialSelected(verifiableCredentialId: number): boolean {
        let items = this.getFormArrayForAdd("verifiableCredentialItems");
        const itemIndex = items.controls.findIndex(
            control => this.getFormArrayItemValueForAdd(control, "id") === verifiableCredentialId
        );
        // if (this.debug)
        //     console.log("CollectionAddEditComponent isCredentialSelected", verifiableCredentialId, itemIndex);
        return itemIndex !== -1;
    }

    hasFiltersForSearch(): boolean {
        const credentialSearchRequest = <CredentialSearchRequestModel>this.searchForm.value;
        return (
            !!credentialSearchRequest.keywords ||
            !!credentialSearchRequest.issuerName ||
            !!credentialSearchRequest.achievementType ||
            !!credentialSearchRequest.effectiveAtYear
        );
    }

    isEdit(): boolean {
        const collection = <CredentialCollectionAddEditRequestResponseModel>this.addEditForm.value;
        return collection.credentialCollectionId > 0;
    }
    handleSelectCredential(credentialEventData: any) {
        if (this.debug) console.log("CollectionAddEditComponent handleSelectCredential", credentialEventData);
        const { credential, selected } = <{ credential: CredentialCardResponseModel; selected: boolean }>(
            credentialEventData
        );

        let items = this.getFormArrayForAdd("verifiableCredentialItems");
        if (this.debug) console.log("CollectionAddEditComponent handleSelectCredential items", items);

        if (selected) {
            const listItem: ListItem = {
                id: credential.verifiableCredentialId,
                name: credential.name,
            };
            const itemGroup = this.formBuilder.group(listItem);
            items.push(itemGroup);

            if (this.debug) console.log("CollectionAddEditComponent handleSelectCredential items push", itemGroup);
        } else {
            const itemIndex = items.controls.findIndex(
                control => control.get("id")?.value === credential.verifiableCredentialId
            );
            if (itemIndex !== -1) {
                items.removeAt(itemIndex);
            }

            if (this.debug) console.log("CollectionAddEditComponent handleSelectCredential items remove", itemIndex);
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

    handleRemoveCredential(index: number, verifiableCredentialId: number) {
        if (this.debug) console.log("CollectionAddEditComponent handleRemoveCredential", index, verifiableCredentialId);

        let items = this.getFormArrayForAdd("verifiableCredentialItems");
        if (this.debug) console.log("CollectionAddEditComponent handleRemoveCredential items", items);

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
        if (this.debug) console.log("CollectionAddEditComponent handleSubmitForAdd", this.addEditForm);

        if (this.addEditForm.valid) {
            this.addOrEditSpinner = true;
            const collectionAddEditRequestResponse = <CredentialCollectionAddEditRequestResponseModel>(
                this.addEditForm.value
            );
            if (this.debug)
                console.log(
                    "CollectionAddEditComponent handleSubmitForAdd form.value",
                    collectionAddEditRequestResponse
                );
            if (collectionAddEditRequestResponse?.credentialCollectionId > 0) {
                this.collectionService.update(collectionAddEditRequestResponse).subscribe(data => {
                    if (this.debug) console.log("CollectionAddEditComponent handleSubmitForAdd data update", data);
                    if (data.statusCode == 200) {
                        const credentialCollectionId = (<ApiOkResult<number>>data).result;
                        this.router.navigate([`/collections/${credentialCollectionId}/details`]);
                    } else {
                        this.modelErrors = (<ApiBadRequestResponse>data).errors;
                    }
                    this.addOrEditSpinner = false;
                });
            } else {
                this.collectionService.add(collectionAddEditRequestResponse).subscribe(data => {
                    if (this.debug) console.log("CollectionAddEditComponent handleSubmitForAdd data add", data);
                    if (data.statusCode == 200) {
                        const credentialCollectionId = (<ApiOkResult<number>>data).result;
                        this.router.navigate([`/collections/${credentialCollectionId}/details`]);
                    } else {
                        this.modelErrors = (<ApiBadRequestResponse>data).errors;
                    }
                    this.addOrEditSpinner = false;
                });
            }
        } else {
            this.addEditForm.markAllAsTouched();
        }
    }

    patchValueForAdd(data: CredentialCollectionAddEditRequestResponseModel): void {
        if (this.debug) console.log("CollectionAddEditComponent patchValueForAdd", data);

        const { credentialCollectionId, name, description } = data;
        const newObject = { credentialCollectionId, name, description };

        this.addEditForm.patchValue(newObject);

        if (data.verifiableCredentialItems && data.verifiableCredentialItems.length) {
            let items = this.getFormArrayForAdd("verifiableCredentialItems");
            items.clear();
            data.verifiableCredentialItems.forEach(listItem => {
                const itemGroup = this.formBuilder.group(listItem);
                items.push(itemGroup);
            });
        }
    }
}
