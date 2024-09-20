import { HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { PublicShareRequestViewModel } from "./publicShareRequestViewModel";
import { PublicShareDetailResponseViewModel } from "./publicShareDetailResponseViewModel";

@Injectable({
    providedIn: "root",
})
export class ShareAccessService {
    private debug = false;

    public credentialAdded: EventEmitter<void> = new EventEmitter<void>();
    public publicShareDetailResponseViewModel: Observable<ApiResponse>;

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    getShareAccesss(shareId: string, hash: string): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}publicshares/${shareId}?hash=${hash}`;

        if (this.debug) console.log(`ShareAccess service ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    getShareDetails(shareId: string, model: PublicShareRequestViewModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}publicshares/${shareId}`;
        if (this.debug) console.log(`ShareAccess service ${urlApi}`);
        var response = this.http
            .post<ApiResponse>(urlApi, model)
            .pipe(catchError(err => this.utilsService.handleError(err)));
        this.publicShareDetailResponseViewModel = response;
        return response;
    }

    getFormData<T>(formValue: T): FormData {
        if (this.debug) console.log("ShareAccess service getFormData", formValue);

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
