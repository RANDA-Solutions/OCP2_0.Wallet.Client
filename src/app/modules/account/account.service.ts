import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { AccountProfileRequestModel } from "@shared/models/accountProfileRequestModel";
import { ApiResponse } from "@shared/models/apiResponse";
import { RegisterAccountVM } from "@shared/models/registerAccountVM";
import { VerifyEmailVM } from "@shared/models/verifyEmailVM";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    baseUrl = environment.publicEndPoint;
    private debug = false;

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    confirmEmailAccount(userId: string, code: string): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/confirmEmail/${userId}?code=${code}`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.post<ApiResponse>(urlApi, null).pipe(catchError(err => this.utilsService.handleError(err)));
    }
    confirmEmailChange(input: VerifyEmailVM): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/ConfirmEmailChange`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.post<ApiResponse>(urlApi, input).pipe(catchError(err => this.utilsService.handleError(err)));
    }
    getProfile(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/getProfile`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }
    saveProfile(model: AccountProfileRequestModel): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/saveProfile`;
        if (this.debug) console.log(`account service ${urlApi}`);
        const formData = this.getFormData<AccountProfileRequestModel>(model);
        return this.http
            .post<ApiResponse>(urlApi, formData)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }

    getEmail(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}email/getEmail`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    changeEmail(data: VerifyEmailVM): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}Public/Account/ChangeEmail`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.post<ApiResponse>(urlApi, data).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    saveEmail(args: any): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}email/saveEmail`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.post<ApiResponse>(urlApi, args).pipe(catchError(err => this.utilsService.handleError(err)));
    }
    sendVerificationEmail(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/verificationEmail`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    getProfileImage(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/getProfileImage`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    registerAccount(input: RegisterAccountVM): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/register`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.post<ApiResponse>(urlApi, input).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    saveProfileImage(args: any): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/saveProfileImage`;
        if (this.debug) console.log(`links service ${urlApi}`);
        if (this.debug) console.log(args);
        return this.http.post<ApiResponse>(urlApi, args).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    removeProfileImage(): Observable<ApiResponse> {
        return this.http
            .post<ApiResponse>(`${environment.apiEndPoint}account/removeProfileImage`, null)
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }

    getTwoFAVM(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/getTwoFAVM`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    deleteUser(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}account/deleteUser`;
        if (this.debug) console.log(`account service ${urlApi}`);
        return this.http.post<ApiResponse>(urlApi, null).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    login(userName, password, returnUrl) {
        const headers = new HttpHeaders();
        const apiUrl = `${environment.apiEndPoint}authenticate/login`;
        const formData = { email: userName, password, returnUrl };
        headers.append("Content-Type", "application/json");
        return this.http.post<ApiResponse>(encodeURI(apiUrl), formData, { headers });
    }

    getFormData<T>(formValue: T): FormData {
        if (this.debug) console.log("account service getFormData", formValue);

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
