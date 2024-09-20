import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LogService } from "@core/error-handling/logerror.service";
import { SafeIdPipe } from "@shared/pipes/safeId.pipe";
import { SharedModule } from "@shared/shared.module";
import { PackageCardComponent } from "./components/package-card/package-card.component";
import { PackagesRouterModule } from "./packages.router";
import { PackageSearchComponent } from "./pages/package-search/package-search.component";
import { PackageDetailsComponent } from "./pages/package-details/package-details.component";
import { PackageImportComponent } from "./pages/package-import/package-import.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PackageDeletePopupComponent } from "./components/package-delete-popup/package-delete-popup.component";

@NgModule({
    imports: [SharedModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, PackagesRouterModule],
    declarations: [
        SafeIdPipe,
        PackageCardComponent,
        PackageSearchComponent,
        PackageDetailsComponent,
        PackageImportComponent,
        PackageDeletePopupComponent,
    ],
    providers: [LogService],
})
export class PackagesModule {
    static forRoot(): ModuleWithProviders<PackagesModule> {
        return {
            ngModule: PackagesModule,
        };
    }
}
