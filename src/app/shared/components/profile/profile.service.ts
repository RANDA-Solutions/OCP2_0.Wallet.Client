import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UtilsService } from "@core/services/utils.service";
import { environment } from "@environment/environment";
import { ApiResponse } from "@shared/models/apiResponse";
import { Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class ProfileService {
    private debug = false;
    // signal for account and anyone updating the profile info that's stored from getProfile to refresh
    private refreshSubject = new Subject<void>();
    refreshTrigger = this.refreshSubject.asObservable();

    constructor(
        private http: HttpClient,
        private utilsService: UtilsService
    ) {}

    getProfile(): Observable<ApiResponse> {
        const urlApi = `${environment.apiEndPoint}profile`;
        if (this.debug) console.log(`profile service ${urlApi}`);
        return this.http.get<ApiResponse>(urlApi).pipe(catchError(err => this.utilsService.handleError(err)));
    }

    refreshProfile() {
        if (this.debug) console.log(`profile service refreshProfile`);
        this.refreshSubject.next();
    }
}
