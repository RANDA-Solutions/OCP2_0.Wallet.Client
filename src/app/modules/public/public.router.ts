import { RouterModule, Routes } from "@angular/router";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";
import { FaqsComponent } from "./pages/faqs/faqs.component";
import { LockoutComponent } from "./pages/lockout/lockout.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

export const publicRoutes: Routes = [
    { path: "faqs", component: FaqsComponent },
    { path: "lockout", component: LockoutComponent },
    { path: "404", component: NotFoundComponent },
    { path: "access-denied", component: AccessDeniedComponent },
    {
        path: "shares/:shareid",
        loadChildren: () => import("./pages/shares/shares.module").then(m => m.SharesModule),
    },
];

export const PublicRouterModule = RouterModule.forChild(publicRoutes);
