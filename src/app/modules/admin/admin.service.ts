import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from '@core/services/utils.service';
import { environment } from '@environment/environment';
import { ApiResponse } from '@shared/models/apiResponse';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private debug = false;

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getMyId(): Observable<ApiResponse> {
    const urlApi = `${environment.apiEndPoint}User/MyId`;
    console.log(`AdminService ${urlApi}`);
    return this.http.get<ApiResponse>(urlApi)
      .pipe(
        catchError(err => this.utilsService.handleError(err)
        )
      );
  }

  getUsers(): Observable<ApiResponse> {
    const urlApi = `${environment.apiEndPoint}User/Users`;
    console.log(`AdminService ${urlApi}`);
    return this.http.get<ApiResponse>(urlApi)
      .pipe(
        catchError(err => this.utilsService.handleError(err)
        )
      );
  }
}
