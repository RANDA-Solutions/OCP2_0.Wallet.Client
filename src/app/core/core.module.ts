import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule, Optional, SkipSelf } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "@auth/auth.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { GlobalErrorHandler } from "./error-handling/error.handler";
import { throwIfAlreadyLoaded } from "./guards/module-import-guard";
import { AppService } from "./services/app.service";
import { TokenInterceptorService } from "./services/token-interceptor.service";
import { UtilsService } from "./services/utils.service";
import { CollectionService } from "./services/collection.service";
import { CredentialService } from "./services/credentials.service";
import { PackageService } from "./services/package.service";
import { RevocationService } from "./services/revocation.service";

@NgModule({
    imports: [HttpClientModule, BrowserAnimationsModule, ToastModule],
    providers: [
        AppService,
        AuthService,
        CollectionService,
        CredentialService,
        MessageService,
        PackageService,
        RevocationService,
        UtilsService,
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
        },

        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true,
        },
    ],
    exports: [BrowserAnimationsModule, HttpClientModule, ToastModule],
    declarations: [],
})
export class CoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule
    ) {
        throwIfAlreadyLoaded(parentModule, "CoreModule");
    }
}
