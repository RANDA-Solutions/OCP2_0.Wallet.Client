import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShareHistoryComponent } from "./pages/share-history/share-history.component";
import { ShareAddComponent } from "./pages/share-add/share-add.component";
import { ShareSelectCollectionsComponent } from "./pages/share-select-collections/share-select-collections.component";
import { ShareSelectCredentialsComponent } from "./pages/share-select-credentials/share-select-credentials.component";

export const sharesRoutes: Routes = [
    {
        path: "history",
        component: ShareHistoryComponent,
    },
    {
        path: "select-collections",
        component: ShareSelectCollectionsComponent,
    },
    {
        path: "select-credentials",
        component: ShareSelectCredentialsComponent,
    },
    {
        path: "add",
        component: ShareAddComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(sharesRoutes)],
    exports: [RouterModule],
})
export class SharesRoutingModule {}
