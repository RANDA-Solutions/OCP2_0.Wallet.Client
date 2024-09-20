import { ModuleWithProviders, NgModule } from "@angular/core";
import { LogService } from "@core/error-handling/logerror.service";
import { SharesRouterModule } from "./shares.router";
import { ShareAccessComponent } from "./pages/share-access/share-access.component";
import { ShareDetailsComponent } from "./pages/share-details/share-details.component";
import { PublicCredentialCardComponent } from "./components/credential-card/credential-card.component";
import { SharedModule } from "@shared/shared.module";
import { PublicEvidencePopupComponent } from "./components/evidence-popup/evidence-popup.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    imports: [SharedModule, FontAwesomeModule, SharesRouterModule],
    declarations: [
        ShareAccessComponent,
        ShareDetailsComponent,
        PublicCredentialCardComponent,
        PublicEvidencePopupComponent,
    ],
    providers: [LogService],
})
export class SharesModule {
    static forRoot(): ModuleWithProviders<SharesModule> {
        return {
            ngModule: SharesModule,
        };
    }
}
