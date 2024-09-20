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
import { CredentialSearchRequestModel } from "@shared/models/credentialSearchRequestModel";
import { CredentialsSearchResponseModel } from "@shared/models/credentialsSearchResponseModel";
import { debounceTime } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { CredentialCardResponseModel } from "@shared/components/credential-card/credentialCardResponseModel";
import { CustomValidators } from "../share-select-collections/custom-validators";
import { ShareCredentialsRequestModel } from "./shareCredentialsRequestModel";
import { CredentialService } from "@core/services/credentials.service";
import { ListItem } from "@shared/models/listItem";
import { PackageDetailsResponseModel } from "@shared/models/packageDetailsResponseModel";
import { PackageService } from "@core/services/package.service";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
    templateUrl: "./share-select-credentials.component.html",
    styleUrls: ["./share-select-credentials.component.scss"],
})
export class ShareSelectCredentialsComponent implements OnInit {
    faTimes = faTimes;
    faSearch = faSearch;
    credentialsSearchResponse: CredentialsSearchResponseModel = new CredentialsSearchResponseModel();
    selectedVerifiableCredentialItems: ListItem[] = [];
    addEditForm: FormGroup;
    searchForm: FormGroup;
    modelErrors = new Array<string>();
    searchSpinner = false;
    addOrEditSpinner = false;

    private debug = false;

    constructor(
        private route: ActivatedRoute,
        private credentialService: CredentialService,
        private packageService: PackageService,
        private router: Router,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any
    ) {}

    async ngOnInit() {
        if (this.debug) console.log("ShareSelectCredentialsComponent ngOnInit");

        this.addEditForm = this.formBuilder.group({
            verifiableCredentialItems: this.formBuilder.array<ListItem>([], {
                validators: CustomValidators.atLeastOneItemValidator(),
            } as AbstractControlOptions),
        } as AbstractControlOptions);

        this.searchForm = this.formBuilder.group(this.createFormGroupForSearch(new CredentialSearchRequestModel()));

        // check state for verifiableCredentialIds or credentialCollectionIds!
        const verifiableCredentialIds = history.state.verifiableCredentialIds;
        const packageId = history.state.packageId;

        if (verifiableCredentialIds) {
            if (this.debug) console.log("ShareSelectCredentials ngOnInit state", verifiableCredentialIds);
            this.patchValueForAdd(verifiableCredentialIds);
            this.setCredentialSelected(verifiableCredentialIds);

            // nothing else to do here for getting credentials
        }

        if (packageId) {
            if (this.debug) console.log("ShareAddComponent ngOnInit state", packageId);
            this.getCredentialIdsByPackage(packageId);
        }

        // load our initial results
        this.getAvailableCredentials(this.searchForm.value);

        // hookup for changes
        this.onChangesForSearch();
    }

    createFormGroupForSearch(model: CredentialSearchRequestModel): { [key: string]: FormControl } {
        if (this.debug) console.log("ShareSelectCredentialsComponent createFormGroupForSearch", model);
        const group: { [key: string]: FormControl } = {};
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                group[key] = new FormControl((model as any)[key]);
            }
        }
        return group;
    }

    onChangesForSearch(): void {
        if (this.debug) console.log("ShareSelectCredentialsComponent onChangesForSearch");
        this.searchForm.valueChanges
            .pipe(debounceTime(300)) // wait 300ms after the last event before emitting last event
            .subscribe((val: CredentialSearchRequestModel) => {
                if (this.debug) console.log("ShareSelectCredentialsComponent onChanges val", val);
                this.getAvailableCredentials(val);
            });
    }

    getAvailableCredentials(credentialsSearchRequest: CredentialSearchRequestModel): void {
        this.searchSpinner = true;
        if (this.debug)
            console.log("ShareSelectCredentialsComponent getAvailableCredentials", credentialsSearchRequest);
        this.credentialService.search(credentialsSearchRequest).subscribe(data => {
            if (this.debug) console.log("ShareSelectCredentialsComponent getAvailableCredentials data", data);
            if (data.statusCode == 200) {
                this.credentialsSearchResponse = (<ApiOkResult<CredentialsSearchResponseModel>>data).result;
            } else {
                this.credentialsSearchResponse = new CredentialsSearchResponseModel();
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.searchSpinner = false;
        });
    }

    getCredentialIdsByPackage(packageId: any): void {
        if (this.debug) console.log("getCredentialIdsByPackage getData", packageId);

        this.packageService.get(packageId).subscribe(data => {
            if (data.statusCode == 200) {
                // get list of verifiableCredentialsId from the package
                const packageDetailsResponseModel = (<ApiOkResult<PackageDetailsResponseModel>>data).result;
                const shareCredentialsRequest = new ShareCredentialsRequestModel();
                const listItem: ListItem[] = [];

                //loop through the verifiable credentials and get id and and name
                packageDetailsResponseModel.verifiableCredentialIds.forEach(vcid => {
                    this.credentialService.getCard(vcid).subscribe(data => {
                        if (data.statusCode == 200) {
                            let credentialCardResponseModel = (<ApiOkResult<CredentialCardResponseModel>>data).result;
                            //pull off verifiableCredentialId & name for sharing purposes
                            const id = credentialCardResponseModel.verifiableCredentialId;
                            const name = credentialCardResponseModel.name;

                            // Creating a ListItem object with both id and name
                            const item: ListItem = { id, name };

                            // Add the ListItem object to the listItem array
                            listItem.push(item);
                            shareCredentialsRequest.verifiableCredentialItems = listItem;
                            this.patchValueForAdd(shareCredentialsRequest.verifiableCredentialItems);
                            this.setCredentialSelected(item.id);
                        } else {
                            this.modelErrors = (<ApiBadRequestResponse>data).errors;
                        }
                    });
                });
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
        });
    }

    resetFiltersForSearch(): void {
        if (this.debug) console.log("ShareSelectCredentialsComponent resetFiltersForSearch");

        this.searchForm.setValue(new CredentialSearchRequestModel());
    }

    // Helper method to set form control values
    setFormControlValueForSearch<K extends keyof CredentialSearchRequestModel>(
        control: K,
        value: CredentialSearchRequestModel[K]
    ): void {
        if (this.debug) console.log("ShareSelectCredentialsComponent setFormControlValueForSearch", control, value);

        (this.searchForm.get(control) as FormControl).setValue(value);
    }

    // Helper method to get form control values
    getFormControlValueForSearch<K extends keyof CredentialSearchRequestModel>(
        control: K
    ): CredentialSearchRequestModel[K] | null {
        // if (this.debug) console.log("ShareSelectCredentialsComponent getFormControlValueForSearch", control);

        return this.searchForm.get(control)?.value ?? null;
    }

    getFormArrayForAdd<K extends keyof ShareCredentialsRequestModel>(control: K): FormArray {
        // if (this.debug) console.log("ShareSelectCredentialsComponent getFormArrayForAdd", control);

        return this.addEditForm.get(control) as FormArray;
    }
    getFormArrayItemValueForAdd<K extends keyof ListItem>(item: AbstractControl<any, any>, control: K): any {
        // if (this.debug) console.log("ShareSelectCredentialsComponent getFormArrayItemForAdd", item, control);

        return item.get(control)?.value;
    }

    setCredentialSelected(verifiableCredentialId: number): void {
        console.log("setCredentialSelected", verifiableCredentialId);
        let items = this.getFormArrayForAdd("verifiableCredentialItems");
        const itemIndex = items.controls.findIndex(
            control => this.getFormArrayItemValueForAdd(control, "id") === verifiableCredentialId
        );
    }

    isCredentialSelected(verifiableCredentialId: number): boolean {
        let items = this.getFormArrayForAdd("verifiableCredentialItems");
        const itemIndex = items.controls.findIndex(
            control => this.getFormArrayItemValueForAdd(control, "id") === verifiableCredentialId
        );
        // if (this.debug)
        //     console.log("ShareSelectCredentialsComponent isCredentialSelected", verifiableCredentialId, itemIndex);
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

    handleSelectCredential(credentialEventData: any) {
        if (this.debug) console.log("ShareSelectCredentialsComponent handleSelectCredential", credentialEventData);
        const { credential, selected } = <{ credential: CredentialCardResponseModel; selected: boolean }>(
            credentialEventData
        );

        let items = this.getFormArrayForAdd("verifiableCredentialItems");
        if (this.debug) console.log("ShareSelectCredentialsComponent handleSelectCredential items", items);

        if (selected) {
            const listItem: ListItem = {
                id: credential.verifiableCredentialId,
                name: credential.name,
            };
            const itemGroup = this.formBuilder.group(listItem);
            items.push(itemGroup);

            if (this.debug) console.log("ShareSelectCredentialsComponent handleSelectCredential items push", itemGroup);
        } else {
            const itemIndex = items.controls.findIndex(
                control => control.get("id")?.value === credential.verifiableCredentialId
            );
            if (itemIndex !== -1) {
                items.removeAt(itemIndex);
            }

            if (this.debug)
                console.log("ShareSelectCredentialsComponent handleSelectCredential items remove", itemIndex);
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
        if (this.debug)
            console.log("ShareSelectCredentialsComponent handleRemoveCredential", index, verifiableCredentialId);

        let items = this.getFormArrayForAdd("verifiableCredentialItems");
        if (this.debug) console.log("ShareSelectCredentialsComponent handleRemoveCredential items", items);

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
        if (this.debug) console.log("ShareSelectCredentialsComponent handleSubmitForAdd", this.addEditForm);

        if (this.addEditForm.valid) {
            this.addOrEditSpinner = true;
            const shareCredentialsRequest = <ShareCredentialsRequestModel>this.addEditForm.value;
            if (this.debug)
                console.log("ShareSelectCredentialsComponent handleSubmitForAdd form.value", shareCredentialsRequest);

            this.router.navigate(["/shares/add"], {
                state: {
                    verifiableCredentialIds: shareCredentialsRequest.verifiableCredentialItems.map(sc => sc.id),
                },
            });
        } else {
            this.addEditForm.markAllAsTouched();
        }
    }

    patchValueForAdd(data: ListItem[]): void {
        if (this.debug) console.log("ShareSelectCredentialsComponent patchValueForAdd", data);

        this.addEditForm.patchValue(data);
        console.log("ShareSelectCredentialsComponent patchValueForAdd", data);
        console.log("ShareSelectCredentialsComponent patchValueForAdd", data.length);

        if (data && data.length) {
            let items = this.getFormArrayForAdd("verifiableCredentialItems");
            items.clear();
            data.forEach(listItem => {
                const itemGroup = this.formBuilder.group(listItem);
                items.push(itemGroup);
            });
        }
    }
}
