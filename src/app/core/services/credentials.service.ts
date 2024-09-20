import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { CredentialSearchRequestModel } from "../../shared/models/credentialSearchRequestModel";

@Injectable({
    providedIn: "root",
})
export class CredentialService {
    private debug = false;

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    search(credentialsSearchRequest: CredentialSearchRequestModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}credentials`;
        if (this.debug) console.log(`CredentialService.search ${urlApi}`, credentialsSearchRequest);
        return this.http
            .post<ApiResponse>(urlApi, credentialsSearchRequest)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
    getCard(verifiableCredentialId: number): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}credentials/${verifiableCredentialId}/card`;
        if (this.debug) console.log(`CredentialService.getCard ${urlApi}`, verifiableCredentialId);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }
    delete(verifiableCredentialId: number): Observable<any> {
        const urlApi = `${environment.apiEndPoint}credentials/${verifiableCredentialId}`;
        if (this.debug) console.log(`CredentialService.delete ${urlApi}`, verifiableCredentialId);
        return this.http
            .delete<any>(urlApi, { observe: "response" })
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
}
