import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControlOptions, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ShareService } from "@modules/shares/services/share.service";
import { ShareAddRequestModel } from "@modules/shares/services/shareAddRequestModel";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { CustomValidators } from "./custom-validators";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { MessageService } from "primeng/api";

@Component({
    templateUrl: "./share-add.component.html",
    styleUrls: ["./share-add.component.scss"],
})
export class ShareAddComponent implements OnInit {
    shareAddRequest: ShareAddRequestModel = new ShareAddRequestModel();
    verifiableCredentialIds: number[] = new Array<number>();
    addForm: FormGroup;
    shareSpinner = false;
    credentialSpinner = false;
    modelErrors = new Array<string>();
    private debug = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private shareService: ShareService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        @Inject(DOCUMENT) private document: any
    ) {}

    async ngOnInit() {
        if (this.debug) console.log("ShareAddComponent ngOnInit");

        // define form
        this.addForm = this.formBuilder.group({
            email: [
                null,
                Validators.compose([
                    CustomValidators.maxLengthConditionalValidator(256),
                    Validators.required,
                    Validators.email,
                ]),
            ],
            description: [null, CustomValidators.maxLengthConditionalValidator(1000)],
            verifiableCredentialIds: this.formBuilder.array<number>([], null),
            credentialCollectionIds: this.formBuilder.array<number>([], null),
        } as AbstractControlOptions);

        const shareAddRequest = new ShareAddRequestModel();

        // check state for verifiableCredentialIds or credentialCollectionIds!
        const verifiableCredentialIds = history.state.verifiableCredentialIds;
        const credentialCollectionIds = history.state.credentialCollectionIds;

        if (!!verifiableCredentialIds) {
            if (this.debug) console.log("ShareAddComponent ngOnInit state", verifiableCredentialIds);
            shareAddRequest.verifiableCredentialIds = verifiableCredentialIds;
            this.verifiableCredentialIds = verifiableCredentialIds;
            // nothing else to do here for getting credentials
        } else if (!!credentialCollectionIds) {
            if (this.debug) console.log("ShareAddComponent ngOnInit state", credentialCollectionIds);
            shareAddRequest.credentialCollectionIds = credentialCollectionIds;
            this.getCredentialIds(credentialCollectionIds);
        } else {
            // reroute as no selected credentials or collections present
            this.router.navigate(["/packages"]);
        }

        // clear state
        history.replaceState({}, "");

        this.patchValue(shareAddRequest);
    }

    getCredentialIds(credentialCollectionIds): void {
        this.credentialSpinner = true;
        if (this.debug) console.log("ShareAddComponent getCredentialIds", this.shareAddRequest.credentialCollectionIds);
        this.shareService.getCredentialIds(credentialCollectionIds).subscribe(data => {
            if (this.debug) console.log("ShareAddComponent getAvailableCredentials data", data);
            if (data.statusCode == 200) {
                this.verifiableCredentialIds = (<ApiOkResult<number[]>>data).result;
            }
            this.credentialSpinner = false;
        });
    }

    hasError(field: string, errorCode: string | null = null): boolean {
        // NOTE: called too frequently for debug
        const formControl = this.addForm.get(field);

        if (!formControl || !formControl.errors || !formControl.touched) {
            return false;
        }

        return errorCode != null ? formControl?.hasError(errorCode) : !formControl?.valid;
    }

    handleSubmit() {
        if (this.debug) console.log("ShareAddComponent handleSubmitForAdd", this.addForm);

        if (this.addForm.valid) {
            this.shareSpinner = true;
            const shareAddRequest = <ShareAddRequestModel>this.addForm.value;
            if (this.debug) console.log("ShareAddComponent handleSubmit form.value", shareAddRequest);
            this.shareService.add(shareAddRequest).subscribe(data => {
                if (data.statusCode == 200) {
                    this.messageService.add({
                        key: "main",
                        severity: "success",
                        summary: "Success Message",
                        detail: `An email has been sent to ${shareAddRequest.email} with instructions for viewing your shared credentials.`,
                    });
                    this.router.navigate([`/shares/history`]);
                } else {
                    this.modelErrors = (<ApiBadRequestResponse>data).errors;
                }
                this.shareSpinner = false;
            });
        } else {
            this.addForm.markAllAsTouched();
        }
    }

    getFormArray<K extends keyof ShareAddRequestModel>(control: K): FormArray {
        // if (this.debug) console.log("CollectionAddEditComponent getFormArrayForAdd", control);

        return this.addForm.get(control) as FormArray;
    }

    patchValue(data: ShareAddRequestModel): void {
        if (this.debug) console.log("ShareAddComponent patchValueForAdd", data);

        const { email, description } = data;
        const newObject = { email, description };

        this.addForm.patchValue(newObject);

        if (data.verifiableCredentialIds && data.verifiableCredentialIds.length) {
            let vcFormArray = this.getFormArray("verifiableCredentialIds");
            vcFormArray.clear();
            data.verifiableCredentialIds.forEach(verifiableCredentialId => {
                vcFormArray.push(this.formBuilder.control(verifiableCredentialId));
            });
        }

        if (data.credentialCollectionIds && data.credentialCollectionIds.length) {
            let ccFormArray = this.getFormArray("credentialCollectionIds");
            ccFormArray.clear();
            data.credentialCollectionIds.forEach(credentialCollectionId => {
                ccFormArray.push(this.formBuilder.control(credentialCollectionId));
            });
        }
    }
}
