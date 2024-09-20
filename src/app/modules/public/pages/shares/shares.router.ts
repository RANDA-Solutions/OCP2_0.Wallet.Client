import { RouterModule, Routes } from "@angular/router";
import { ShareAccessComponent } from "./pages/share-access/share-access.component";
import { ShareDetailsComponent } from "./pages/share-details//share-details.component";

export const sharesRoutes: Routes = [
    {
        path: "details",
        component: ShareDetailsComponent,
    },
    {
        path: ":shareid",
        component: ShareAccessComponent,
    },
    {
        path: "",
        component: ShareAccessComponent,
    } 
];

export const SharesRouterModule = RouterModule.forChild(sharesRoutes);
