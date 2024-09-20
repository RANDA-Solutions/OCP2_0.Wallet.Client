import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable, catchError } from "rxjs";
import { environment } from "@environment/environment";
import { CredentialCollectionsSearchRequestModel } from "@shared/models/credentialCollectionsSearchRequestModel";
import { CredentialCollectionAddEditRequestResponseModel } from "@shared/models/credentialCollectionAddEditRequestResponseModel";

@Injectable({
    providedIn: "root",
})
export class CollectionService {
    private debug = false;

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    search(collectionsSearchRequest: CredentialCollectionsSearchRequestModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}collections`;
        if (this.debug) console.log(`CollectionService.search ${urlApi}`, collectionsSearchRequest);
        return this.http
            .post<ApiResponse>(urlApi, collectionsSearchRequest)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }

    delete(credentialCollectionId: number): Observable<any> {
        const urlApi = `${environment.apiEndPoint}collections/${credentialCollectionId}`;
        if (this.debug) console.log(`CollectionService.delete ${urlApi}`, credentialCollectionId);
        return this.http
            .delete<any>(urlApi, { observe: "response" })
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
    getCard(credentialCollectionId: number): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}collections/${credentialCollectionId}/card`;
        if (this.debug) console.log(`CollectionService.getCard ${urlApi}`, credentialCollectionId);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }
    add(credentialCollection: CredentialCollectionAddEditRequestResponseModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}collections`;
        if (this.debug) console.log(`CollectionService.add ${urlApi}`, credentialCollection);
        return this.http
            .put<ApiResponse>(urlApi, credentialCollection)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
    update(credentialCollection: CredentialCollectionAddEditRequestResponseModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}collections/${credentialCollection.credentialCollectionId}`;
        if (this.debug) console.log(`CollectionService.update ${urlApi}`, credentialCollection);
        return this.http
            .post<ApiResponse>(urlApi, credentialCollection)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
    get(credentialCollectionId: number): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}collections/${credentialCollectionId}`;
        if (this.debug) console.log(`CollectionService.get ${urlApi}`, credentialCollectionId);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }
}
