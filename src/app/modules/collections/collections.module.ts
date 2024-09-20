import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CollectionsRoutingModule } from "./collections-routing.module";
import { CollectionSearchComponent } from "./pages/collection-search/collection-search.component";
import { CollectionAddEditComponent } from "./pages/collection-add-edit/collection-add-edit.component";
import { SharedModule } from "@shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CollectionDetailsComponent } from "./pages/collection-details/collection-details.component";
import { LogService } from "@core/error-handling/logerror.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [CollectionSearchComponent, CollectionAddEditComponent, CollectionDetailsComponent],
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CollectionsRoutingModule,
        FontAwesomeModule,
    ],
    providers: [LogService],
})
export class CollectionsModule {
    static forRoot(): ModuleWithProviders<CollectionsModule> {
        return {
            ngModule: CollectionsModule,
        };
    }
}
