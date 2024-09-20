import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CollectionSearchComponent } from "./pages/collection-search/collection-search.component";
import { CollectionAddEditComponent } from "./pages/collection-add-edit/collection-add-edit.component";
import { CollectionDetailsComponent } from "./pages/collection-details/collection-details.component";

export const collectionsRoutes: Routes = [
    {
        path: "",
        component: CollectionSearchComponent,
    },
    {
        path: "add",
        component: CollectionAddEditComponent,
    },
    {
        path: ":id/edit",
        component: CollectionAddEditComponent,
    },
    {
        path: ":id/details",
        component: CollectionDetailsComponent,
    },
];
@NgModule({
    imports: [RouterModule.forChild(collectionsRoutes)],
    exports: [RouterModule],
})
export class CollectionsRoutingModule {}
