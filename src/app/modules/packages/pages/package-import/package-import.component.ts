import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { PackageService } from "@core/services/package.service";
import { CustomValidators } from "./custom-validators";
import { PackageAddRequestModel } from "@shared/models/packageAddRequestModel";
import { MessageService } from "primeng/api";

@Component({
    templateUrl: "./package-import.component.html",
    styleUrls: ["./package-import.component.scss"],
})
export class PackageImportComponent implements OnInit {
    importForm: FormGroup;
    fileName = "Choose file with credential";
    uploadSpinner = false;
    modelErrors = new Array<string>();
    private debug = false;
    private maxPackageFileSize = 20 * 1024 * 1024; // 20MB
    private validProfileImageFileTypes = ["application/json", "text/json"];

    constructor(
        private router: Router,
        private _formBuilder: FormBuilder,
        private _packageService: PackageService,
        private _messageService: MessageService
    ) {}

    ngOnInit(): void {
        if (this.debug) console.log("PackageImportComponent ngOnInit");

        this.importForm = this._formBuilder.group({
            packageFile: [
                null,
                Validators.compose([
                    CustomValidators.fileTypeValidator(this.validProfileImageFileTypes),
                    CustomValidators.fileSizeValidator(this.maxPackageFileSize),
                ]),
            ],
        } as AbstractControlOptions);
    }

    onPackageFileSelected(event: any) {
        if (this.debug) console.log("PackageImportComponent onPackageFileSelected", event);
        const file = event.target.files[0];
        if (file) {
            this.importForm.patchValue({
                packageFile: file,
            });
            this.importForm.get("packageFile").markAsDirty();
        }
    }
    onSubmit() {
        if (this.debug) console.log("PackageImportComponent onSubmit");
        if (this.importForm.valid) {
            this.uploadSpinner = true;
            let packageAddRequestModel: PackageAddRequestModel = { ...this.importForm.value };

            return this._packageService.add(packageAddRequestModel).subscribe(data => {
                if (this.debug) console.log("PackageSearchComponent getData data", data);
                if (data.statusCode == 200) {
                    // const id = (<ApiOkResult<number>>data).result;
                    this.router.navigate(["/packages"]);
                } else {
                    this.modelErrors = (<ApiBadRequestResponse>data).errors;
                }
                this.uploadSpinner = false;
            });
        } else {
            this._messageService.add({
                key: "main",
                severity: "error",
                summary: "Error",
                detail: "Please address the invalid fields and try again.",
            });
        }
    }

    hasError(field: string, errorCode: string | null = null): boolean {
        // NOTE: called too frequently for debug
        const formControl = this.importForm.get(field);
        return errorCode != null ? formControl?.hasError(errorCode) : !formControl?.valid;
    }
}
