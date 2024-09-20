import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { PackageService } from "../../../../core/services/package.service";
import { PackagesSearchResponseModel } from "../../../../shared/models/packagesSearchResponseModel";
import { PackagesSearchRequestModel } from "../../../../shared/models/packagesSearchRequestModel";
import { debounceTime } from "rxjs/operators";
import { NotificationService } from "@shared/components/notifications/notification.service";
import { NgbActiveModal, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { PackageDeletePopupComponent } from "@modules/packages/components/package-delete-popup/package-delete-popup.component";
import { PackageSearchResponseModel } from "@shared/models/packageSearchResponseModel";
import { MessageService } from "primeng/api";
import { ProfileService } from "@shared/components/profile/profile.service";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
    templateUrl: "./package-search.component.html",
    styleUrls: ["./package-search.component.scss"],
})
export class PackageSearchComponent implements OnInit {
    faSearch = faSearch;
    faTimes = faTimes;
    packagesSearchResponse: PackagesSearchResponseModel = new PackagesSearchResponseModel();
    packagesSearchRequest: PackagesSearchRequestModel = new PackagesSearchRequestModel();
    activeModal: NgbActiveModal;
    searchForm: FormGroup;
    modelErrors = new Array<string>();
    showSpinner = false;

    private debug = false;

    constructor(
        private packageService: PackageService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private messageService: MessageService,
        private profileService: ProfileService,
        @Inject(DOCUMENT) private document: any
    ) {}

    async ngOnInit() {
        if (this.debug) console.log("PackageSearchComponent ngOnInit");

        this.notificationService.credentialAdded.subscribe(() => {
            this.getData();
        });

        this.searchForm = this.formBuilder.group(this.createFormGroup(this.packagesSearchRequest));

        // load our initial results
        this.getData();

        // hookup for changes
        this.onChanges();
    }

    createFormGroup(model: PackagesSearchRequestModel): { [key: string]: FormControl } {
        if (this.debug) console.log("PackageSearchComponent createFormGroup", model);
        const group: { [key: string]: FormControl } = {};
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                group[key] = new FormControl((model as any)[key]);
            }
        }
        return group;
    }

    onChanges(): void {
        if (this.debug) console.log("PackageSearchComponent onChanges");
        this.searchForm.valueChanges
            .pipe(debounceTime(300)) // wait 300ms after the last event before emitting last event
            .subscribe((val: PackagesSearchRequestModel) => {
                if (this.debug) console.log("PackageSearchComponent onChanges val", val);
                Object.assign(this.packagesSearchRequest, val);
                this.getData();
            });
    }

    getData(): void {
        this.showSpinner = true;
        if (this.debug) console.log("PackageSearchComponent getData", this.packagesSearchRequest);
        this.packageService.search(this.packagesSearchRequest).subscribe(data => {
            if (this.debug) console.log("PackageSearchComponent getData data", data);
            if (data.statusCode == 200) {
                this.packagesSearchResponse = (<ApiOkResult<PackagesSearchResponseModel>>data).result;
            } else {
                this.packagesSearchResponse = new PackagesSearchResponseModel();
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.showSpinner = false;
        });
    }

    resetFilters(): void {
        if (this.debug) console.log("PackageSearchComponent resetFilters");

        this.searchForm.setValue(new PackagesSearchRequestModel());
    }

    // Helper method to set form control values
    setFormControlValue<K extends keyof PackagesSearchRequestModel>(
        control: K,
        value: PackagesSearchRequestModel[K]
    ): void {
        if (this.debug) console.log("PackageSearchComponent setFormControlValue", control, value);

        (this.searchForm.get(control) as FormControl).setValue(value);
    }

    // Helper method to get form control values
    getFormControlValue<K extends keyof PackagesSearchRequestModel>(control: K): PackagesSearchRequestModel[K] | null {
        if (this.debug) console.log("PackageSearchComponent getFormControlValue", control);

        return this.searchForm.get(control)?.value ?? null;
    }
}
