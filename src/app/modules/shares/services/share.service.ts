import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ShareAddRequestModel } from "./shareAddRequestModel";

@Injectable({
    providedIn: "root",
})
export class ShareService {
    private debug = false;

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    list(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}shares`;
        if (this.debug) console.log(`ShareService.list ${urlApi}`);
        return this.http.post<ApiResponse>(urlApi, null).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    get(shareId: number) {
        const urlApi = `${environment.apiEndPoint}shares/${shareId}`;
        if (this.debug) console.log(`ShareService.shareId ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }
    getCredentialIds(credentialCollectionIds: number[]) {
        const urlApi = `${environment.apiEndPoint}shares/collections/credentials`;
        if (this.debug) console.log(`ShareService.getCredentialIds ${urlApi}`, credentialCollectionIds);
        return this.http
            .post<ApiResponse>(urlApi, credentialCollectionIds)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
    add(shareAddRequest: ShareAddRequestModel) {
        const urlApi = `${environment.apiEndPoint}shares`;
        if (this.debug) console.log(`ShareService.add ${urlApi}`, shareAddRequest);
        return this.http
            .put<ApiResponse>(urlApi, shareAddRequest)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
}
