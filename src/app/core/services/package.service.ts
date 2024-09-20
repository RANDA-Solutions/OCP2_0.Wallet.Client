import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { ApiResponse } from "@shared/models/apiResponse";
import { PackagesSearchRequestModel } from "../../shared/models/packagesSearchRequestModel";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { PackageAddRequestModel } from "../../shared/models/packageAddRequestModel";

@Injectable({
    providedIn: "root",
})
export class PackageService {
    private debug = false;

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    search(packagesSearchRequest: PackagesSearchRequestModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}packages`;
        if (this.debug) console.log(`PackageService.search ${urlApi}`, packagesSearchRequest);
        return this.http
            .post<ApiResponse>(urlApi, packagesSearchRequest)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }

    get(credentialPackageId: number): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}packages/${credentialPackageId}`;
        if (this.debug) console.log(`PackageService.get ${urlApi}`, credentialPackageId);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    add(packageAddRequest: PackageAddRequestModel) {
        const urlApi = `${environment.apiEndPoint}packages`;
        if (this.debug) console.log("PackageService.add", packageAddRequest);
        const formData = this.getFormData<PackageAddRequestModel>(packageAddRequest);
        return this.http.put<ApiResponse>(urlApi, formData).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    delete(credentialPackageId: number): Observable<any> {
        const urlApi = `${environment.apiEndPoint}packages/${credentialPackageId}`;
        if (this.debug) console.log(`PackageService.delete ${urlApi}`, credentialPackageId);
        return this.http
            .delete<any>(urlApi, { observe: "response" })
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
    getFormData<T>(formValue: T): FormData {
        if (this.debug) console.log("PackageService.getFormData", formValue);

        const formData = new FormData();

        Object.keys(formValue).forEach(key => {
            const value = (formValue as any)[key];
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        return formData;
    }
}
