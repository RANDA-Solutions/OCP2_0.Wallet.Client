import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { ApiResponse } from "@shared/models/apiResponse";
import jwt_decode from "jwt-decode";
import { MessageService } from "primeng/api";
import { Observable, of } from "rxjs";
import { take } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { LogService } from "../error-handling/logerror.service";
import { ErrorService } from "./error.service";
// https://angular.io/tutorial/toh-pt6#handleerror
/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
@Injectable()
export class UtilsService implements OnDestroy {
    errorId = "N/A";
    private debug = false;
    constructor(
        public logService: LogService,
        public messageService: MessageService,
        public errorService: ErrorService
    ) {}

    ngOnDestroy(): void {}

    handleObjectError(error: Error | HttpErrorResponse): Observable<ApiResponse> {
        if (error instanceof HttpErrorResponse) {
            if (this.debug) console.log(`UtilsService.handleError HttpErrorResponse`);
            // Server Error
            this.logService
                .logNgError(`Http error occurred: ${this.errorService.getServerMessage(error)}`)
                .pipe(take(1))
                .subscribe(
                    data => {
                        this.errorId = data;
                        this.showError(error.message, this.errorId);
                    },
                    logError => {
                        if (error.status === 400) {
                            // check the original error, logError is the logging error
                            this.showError(
                                `An error occurred and logging the error failed.(${this.errorService.getServerMessage(error)})`
                            );
                        } else {
                            // 404
                            this.showError(
                                `An error occurred and logging the error failed.(${this.errorService.getServerMessage(error)})`
                            );
                        }
                    }
                );
            // Let the app keep running by returning an empty result.
            return of({ statusCode: error.status, message: error.message, result: null, redirectUrl: null });
        } else {
            if (this.debug) console.log(`UtilsService.handleError NOT HttpErrorResponse`);
            this.showError(this.errorService.getClientMessage(error));
            // Let the app keep running by returning an empty result.
            return of({ statusCode: 400, message: "Unhandled client error.", result: null, redirectUrl: null });
        }
    }

    handleError(error: Error | HttpErrorResponse): Observable<ApiResponse> {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        if (chunkFailedMessage.test(error.message)) {
            this.showError("Stale code detected, reloading page...");
            window.location.reload();
        }
        if (error instanceof HttpErrorResponse) {
            if (this.debug) console.log(`UtilsService.handleError HttpErrorResponse`);
            // Server Error
            this.logService
                .logNgError(`Http error occurred: ${this.errorService.getServerMessage(error)}`)
                .pipe(take(1))
                .subscribe(
                    data => {
                        this.errorId = data;
                        this.showError(error.message, this.errorId);
                    },
                    logError => {
                        if (error.status === 400) {
                            // check the original error, logError is the logging error
                            this.showError(
                                `An error occurred and logging the error failed.(${this.errorService.getServerMessage(error)})`
                            );
                        } else {
                            // 404
                            this.showError(
                                `An error occurred and logging the error failed.(${this.errorService.getServerMessage(error)})`
                            );
                        }
                    }
                );
            // Let the app keep running by returning an empty result.
            return of(new ApiBadRequestResponse(error.status, error.message, []));
        } else {
            if (this.debug) console.log(`UtilsService.handleError NOT HttpErrorResponse`);
            this.showError(this.errorService.getClientMessage(error));
            // Let the app keep running by returning an empty result.
            return of(new ApiBadRequestResponse(400, "Unhandled client error.", []));
        }
    }
    handleErrorNoLog<T>(error: Error | HttpErrorResponse, result?: T): Observable<T> {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
                //this.authService.refresh();
            } else {
                this.showError(this.errorService.getServerMessage(error));
                // Let the app keep running by returning an empty result.
                return of(result as T);
            }
        } else {
            this.showError(this.errorService.getClientMessage(error));
            // Let the app keep running by returning an empty result.
            return of(result as T);
        }
    }

    showError(message: string, id?: string) {
        let header: string;
        if (id) {
            header = `ErrorId: ${id}`;
        } else {
            header = `Unlogged error`;
        }
        this.messageService.add({
            key: "main",
            severity: "error",
            summary: header,
            detail: message.substring(0, 255),
            life: environment.errorMessageLife,
        });
    }

    showAlert(message: string) {
        this.messageService.add({
            key: "main",
            severity: "info",
            summary: "Alert Message",
            detail: message,
        });
    }
    showWarning(message: string) {
        this.messageService.add({
            key: "main",
            severity: "warning",
            summary: "Alert Message",
            detail: message,
        });
    }
    showSuccess(message: string) {
        this.messageService.add({
            key: "main",
            severity: "success",
            summary: "Success Message",
            detail: message,
        });
    }

    showFailure(message: string) {
        this.messageService.add({
            key: "main",
            severity: "error",
            summary: "Failure Message",
            detail: message,
            life: environment.errorMessageLife,
        });
    }

    isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }

    trimWhiteSpacesFromObjProperties<T>(obj: T) {
        const keys = Object.keys(obj);
        const propertyNames = Object.getOwnPropertyNames(obj);
        if (keys.length > 0) {
            for (const prop of propertyNames) {
                if (typeof obj[prop] === "string") {
                    obj[prop] = obj[prop].trim();
                }
            }
            return obj;
        } else {
            return obj;
        }
    }

    sortingDataAccessor(rawData, header, numericColumns: string) {
        return numericColumns.includes(header)
            ? rawData[header]
                ? Number(rawData[header])
                : 0
            : rawData[header]
              ? rawData[header].toString().toLowerCase()
              : "";
    }

    formatDateShort(val: Date): string {
        if (!!val && typeof val === "string") {
            val = new Date(val);
        }
        if (val) {
            const localDate = new Date(val.getTime() - val.getTimezoneOffset() * 60000);
            return new Intl.DateTimeFormat("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(
                localDate
            );
        } else {
            return "";
        }
    }

    formatDate(val: Date): string {
        if (!!val && typeof val === "string") {
            val = new Date(val);
        }
        if (val) {
            const localDate = new Date(val.getTime() - val.getTimezoneOffset() * 60000);
            return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }).format(localDate);
        } else {
            return "";
        }
    }

    formatDateToLocal(dt: Date): string {
        if (!!dt && typeof dt === "string") {
            dt = new Date(dt);
        }
        if (dt) {
            const options: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "short",
                day: "numeric",
            };
            return new Intl.DateTimeFormat("en-US", options).format(dt);
        } else {
            return "";
        }
    }

    formatInt(val: number, digits: number) {
        if (val) {
            return ("00000000000000000000" + val.toString()).slice(-digits);
        } else {
            return "";
        }
    }

    safeId(text: string) {
        let x = text.replace(new RegExp(/\:/g), "");
        x = x.replace(new RegExp(/\//g), "");
        x = x.replace(new RegExp(/\./g), "");
        return x;
    }
    deserializePayload(value: string): string {
        var decoded = JSON.stringify(jwt_decode(value));
        return decoded;
    }
    getResolvedUrl(route: ActivatedRouteSnapshot): string {
        if (this.debug) console.log(`UtilsService.getResolvedUrl: ${route}`);
        return route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join("/")).join("/");
    }

    getResolveStatedUrl(route: RouterStateSnapshot): string {
        if (this.debug) console.log(`UtilsService.getResolvedUrl: ${route}`);
        return route.root.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join("/")).join("/");
    }
    getConfiguredUrl(route: ActivatedRouteSnapshot): string {
        return (
            "/" +
            route.pathFromRoot
                .filter(v => v.routeConfig)
                .map(v => v.routeConfig!.path)
                .join("/")
        );
    }
}
