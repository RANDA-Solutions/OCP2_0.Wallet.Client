import { RouterModule, Routes } from "@angular/router";
import { ManageComponent } from "./manage.component";
import { AccountProfileComponent } from "./pages/profile/accountprofile.component";

export const accountRoutes: Routes = [
    // {
    //     path: '',
    //     component: ProfileComponent,
    //     canActivate: [AuthGuard]
    // },
    {
        path: "manage",
        component: ManageComponent,
        children: [
            { path: "profile", component: AccountProfileComponent },
            { path: "", redirectTo: "profile", pathMatch: "full" },
        ],
    },
];

export const AccountRouterModule = RouterModule.forChild(accountRoutes);
