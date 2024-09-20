import { HttpClient, } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UtilsService } from '@core/services/utils.service';
import { environment } from '@environment/environment';
import { ApiResponse } from '@shared/models/apiResponse';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  private debug = false;

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getEvidences(verifiableCredentialId : number): Observable<ApiResponse> {

    const urlApi = `${environment.apiEndPoint}evidence/${verifiableCredentialId}`;

    if (this.debug) console.log(`evidence service ${urlApi}`);

    return this.http.get<ApiResponse>(urlApi)
    .pipe(
      catchError(err => this.utilsService.handleError(err))
    );
  }
}
