import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminIndexComponent } from "./admin-index.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { AdminRouterModule } from "./admin.router";
import { LogService } from "@core/error-handling/logerror.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AdminService } from "./admin.service";

@NgModule({
    declarations: [AdminIndexComponent],
    imports: [CommonModule, SharedModule, FormsModule, AdminRouterModule],
    providers: [AdminService, LogService, NgbActiveModal],
    entryComponents: [],
})
export class AdminModule {}
