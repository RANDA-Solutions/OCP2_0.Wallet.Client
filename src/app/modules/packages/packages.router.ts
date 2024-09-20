import { RouterModule, Routes } from "@angular/router";
import { PackageSearchComponent } from "./pages/package-search/package-search.component";
import { PackageDetailsComponent } from "./pages/package-details/package-details.component";
import { PackageImportComponent } from "./pages/package-import/package-import.component";

export const packagesRoutes: Routes = [
    {
        path: "",
        component: PackageSearchComponent,
    },
    {
        path: "import",
        component: PackageImportComponent,
    },
    {
        path: ":id",
        component: PackageDetailsComponent,
    },
];

export const PackagesRouterModule = RouterModule.forChild(packagesRoutes);
