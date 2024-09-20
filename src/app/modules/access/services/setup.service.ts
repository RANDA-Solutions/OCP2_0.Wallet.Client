import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { VerifyAccessCodeRequestModel } from "@shared/models/verifyAccessCodeRequestModel";
import { AccountSetupRequestModel } from "@shared/models/accountSetupRequestModel";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class SetupService {
    private debug = false;
    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    getAccountStatus(email: string): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/setup/email?email=${email}`;

        if (this.debug) console.log(`SetupService getAccountStatus ${urlApi}`);

        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    verifyEmail(model: VerifyAccessCodeRequestModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/setup/email`;

        if (this.debug) console.log(`SetupService verifyEmail ${urlApi}`);

        return this.http
            .post<ApiResponse>(urlApi, model)
            .pipe(catchError(err => this.utilsService.handleErrorNoLog<ApiResponse>(err)));
    }

    getSetup(code: string): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/setup?code=${code}`;

        if (this.debug) console.log(`SetupService getSetup ${urlApi}`);

        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    setup(accountRequestModel: AccountSetupRequestModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/setup`;

        if (this.debug) console.log(`SetupService: setup ${urlApi}`);

        return this.http
            .post<ApiResponse>(urlApi, accountRequestModel)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }

    requestNewLoginLink(code: string): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/setup/login-link?code=${code}`;

        if (this.debug) console.log(`SetupService requestNewLoginLink ${urlApi}`);

        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }
}
