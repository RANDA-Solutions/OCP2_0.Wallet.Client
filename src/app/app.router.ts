import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { TWConstants } from "@shared/models/enums/rolesEnum";
import { LoginLayoutComponent } from "./components/layout/login-layout/login-layout.component";
import { PlainLayoutComponent } from "./components/layout/plain-layout/plain-layout.component";
import { PublicLayoutComponent } from "./components/layout/public-layout/public-layout.component";
import { SecureLayoutComponent } from "./components/layout/secure-layout/secure-layout.component";
import { UnauthorizedComponent } from "./components/unauthorized/unauthorized.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routerOptions: ExtraOptions = {
    useHash: false,
    anchorScrolling: "enabled",
    paramsInheritanceStrategy: "always",
};

export const protectedRoutes = new RegExp(/credentials|collections|shares|packages|account|admin|home/, "i");

export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "access/login",
        pathMatch: "full",
    },
    {
        path: "",
        component: LoginLayoutComponent,
        children: [
            {
                path: "access",
                loadChildren: () => import("./modules/access/access.module").then(m => m.AccessModule),
            },
            {
                path: "Access",
                loadChildren: () => import("./modules/access/access.module").then(m => m.AccessModule),
            },
            {
                path: "unauthorized",
                component: UnauthorizedComponent,
            },
        ],
    },
    {
        path: "",
        component: SecureLayoutComponent,
        children: [
            {
                path: "account",
                loadChildren: () => import("./modules/account/account.module").then(m => m.AccountModule),
                canActivate: [AuthGuard],
            },
            {
                path: "admin",
                loadChildren: () => import("./modules/admin/admin.module").then(m => m.AdminModule),
                // canLoad: [AutoLoginPartialRoutesGuard],
                canActivate: [AuthGuard],
                data: { role: TWConstants.RoleSystemAdmin },
            },
            {
                path: "collections",
                loadChildren: () => import("./modules/collections/collections.module").then(m => m.CollectionsModule),
                canActivate: [AuthGuard],
            },
            {
                path: "packages",
                loadChildren: () => import("./modules/packages/packages.module").then(m => m.PackagesModule),
                canActivate: [AuthGuard],
            },
            {
                path: "shares",
                loadChildren: () => import("./modules/shares/shares.module").then(m => m.SharesModule),
                canActivate: [AuthGuard],
            },
            {
                path: "home",
                redirectTo: "/packages",
                pathMatch: "full",
            },
        ],
    },

    /****************************************************
     * Unprotected routes                               *
     ****************************************************/
    {
        path: "",
        component: PublicLayoutComponent,
        children: [
            {
                path: "public",
                loadChildren: () => import("./modules/public/public.module").then(m => m.PublicModule),
            },
            {
                path: "Public",
                loadChildren: () => import("./modules/public/public.module").then(m => m.PublicModule),
            },
        ],
    },
    {
        path: "s",
        component: PlainLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: () => import("./modules/public/public.module").then(m => m.PublicModule),
            },
        ],
    },
    {
        path: "unauthorized",
        component: UnauthorizedComponent,
    },
    //Wild Card Route for 404 request
    { path: "**", redirectTo: "public/404" },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, routerOptions)],
    exports: [RouterModule],
})
export class AppRouterModule {}
