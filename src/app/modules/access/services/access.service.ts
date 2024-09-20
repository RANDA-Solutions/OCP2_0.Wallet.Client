import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { ResetPasswordModel } from "@shared/interfaces/reset-password.interface";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable } from "rxjs";
import { catchError, take } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class AccessService {
    private baseUrl = environment.publicEndPoint;
    constructor(
        private http: HttpClient,
        private utilsService: UtilsService,
        private router: Router,
        private ngZone: NgZone
    ) {}

    forgotPassword(email) {
        const headers = new HttpHeaders();
        const apiUrl = `${environment.apiEndPoint}Public/Account/Password/Forgot/${email}`;
        headers.append("Content-Type", "application/json");

        return this.http.post<any>(encodeURI(apiUrl), null, { headers }).pipe();
    }

    resendConfirmation(email) {
        const headers = new HttpHeaders();
        const apiUrl = `${environment.apiEndPoint}Public/Account/Confirmation/Resend/${email}`;
        headers.append("Content-Type", "application/json");

        return this.http.post<any>(encodeURI(apiUrl), null, { headers }).pipe();
    }

    resetPassword(input: ResetPasswordModel) {
        const headers = new HttpHeaders();
        const apiUrl = `${environment.apiEndPoint}Public/Account/Password/Reset`;

        return this.http.post<ApiResponse>(apiUrl, input).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    setPassword(password) {
        const headers = new HttpHeaders();
        const apiUrl = `${environment.apiEndPoint}setpassword/set`;
        const formData = { password };
        headers.append("Content-Type", "application/json");

        return this.http.post<any>(encodeURI(apiUrl), formData, { headers }).pipe();
    }

    signOut(infoMessage?: string): Observable<ApiResponse> {
        const headers = new HttpHeaders();
        const apiUrl = `${environment.apiEndPoint}logout`;
        headers.append("Content-Type", "application/json");
        return this.http
            .post<ApiResponse>(encodeURI(apiUrl), null, { headers })
            .pipe(catchError(err => this.utilsService.handleError(err)));
    }
}
