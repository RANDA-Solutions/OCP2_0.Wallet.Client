import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LogService } from "@core/error-handling/logerror.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "@shared/shared.module";
import { AccountRouterModule } from "./account.router";
import { AccountService } from "./account.service";
import { ManageComponent } from "./manage.component";
import { AccountProfileComponent } from "./pages/profile/accountprofile.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
@NgModule({
    imports: [SharedModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, AccountRouterModule],
    declarations: [ManageComponent, AccountProfileComponent],
    providers: [AccountService, LogService, NgbActiveModal],
})
export class AccountModule {
    static forRoot(): ModuleWithProviders<AccountModule> {
        return {
            ngModule: AccountModule,
        };
    }
}
