import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable } from "rxjs";
import { catchError, share } from "rxjs/operators";
import { ShareAccessService } from "./share-access.service";
import { PublicShareRequestViewModel } from "./publicShareRequestViewModel";

@Injectable({
    providedIn: "root",
})
export class CredentialService {
    private debug = false;

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    getCard(
        verifiableCredentialId: number,
        shareId: number,
        publicShareRequestViewModel: PublicShareRequestViewModel
    ): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}publicshares/${shareId}/credentials/${verifiableCredentialId}`;
        if (this.debug) console.log(`CredentialService.getCard ${urlApi}`, verifiableCredentialId);
        return this.http
            .post<ApiResponse>(urlApi, publicShareRequestViewModel)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
}
