import { RouterModule, Routes } from "@angular/router";
import { AdminIndexComponent } from "./admin-index.component";
import { AdminLandingComponent } from "./pages/landing/landing.component";

export const adminRoutes: Routes = [
    {
        path: "",
        component: AdminIndexComponent,
        children: [{ path: "landing", component: AdminLandingComponent }],
    },
];

export const AdminRouterModule = RouterModule.forChild(adminRoutes);
