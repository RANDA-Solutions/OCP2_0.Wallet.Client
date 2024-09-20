import { HttpClient, } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { UtilsService } from '@core/services/utils.service';
import { environment } from '@environment/environment';
import { ApiResponse } from '@shared/models/apiResponse';
import { NotificationViewModel } from '@shared/models/notificationViewModel';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private debug = false;

  public credentialAdded: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getNotifications(): Observable<ApiResponse> {

    const urlApi = `${environment.apiEndPoint}notifications`;

    if (this.debug) console.log(`notification service ${urlApi}`);

    return this.http.get<ApiResponse>(urlApi)
    .pipe(
      catchError(err => this.utilsService.handleError(err))
    );
  }

  markAsRead(notificationDetail: NotificationViewModel): Observable<ApiResponse> {

    const urlApi = `${environment.apiEndPoint}notifications/${notificationDetail.notificationId}/read`;

    if (this.debug) console.log(`notification service ${urlApi}`);

    return this.http.put<ApiResponse>(urlApi, notificationDetail.notificationId)
    .pipe(
      catchError(err => this.utilsService.handleError(err))
    );
  }

  markAsUnread(notificationDetail: NotificationViewModel): Observable<ApiResponse> {

    const urlApi = `${environment.apiEndPoint}notifications/${notificationDetail.notificationId}/unread`;

    if (this.debug) console.log(`notification service ${urlApi}`);

    return this.http.put<ApiResponse>(urlApi, notificationDetail.notificationId)
    .pipe(
      catchError(err => this.utilsService.handleError(err))
    );
  }

  addCredential(notificationDetail: NotificationViewModel): Observable<ApiResponse> {

    const urlApi = `${environment.apiEndPoint}notifications/${notificationDetail.notificationId}/credential`;

    if (this.debug) console.log(`notification service ${urlApi}`);

    return this.http.post<ApiResponse>(urlApi, notificationDetail.notificationId)
    .pipe(
      tap(() => this.credentialAdded.emit()), // Emit event on successful add
      catchError(err => this.utilsService.handleError(err))
    );
  }

}
