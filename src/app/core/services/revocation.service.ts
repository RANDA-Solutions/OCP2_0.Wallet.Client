import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class RevocationService {
    private debug = false;

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    getRevocation(verifiableCredentialId: number): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}public/credentials/${verifiableCredentialId}/revocation`;
        if (this.debug) console.log(`RevocationService.getRevocation ${urlApi}`, verifiableCredentialId);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }
}
