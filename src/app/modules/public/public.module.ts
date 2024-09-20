import { ModuleWithProviders, NgModule } from "@angular/core";
import { LogService } from "@core/error-handling/logerror.service";
import { SharedModule } from "@shared/shared.module";
import { PublicRouterModule } from "./public.router";
import { LockoutComponent } from "./pages/lockout/lockout.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";
import { FaqsComponent } from "./pages/faqs/faqs.component";
@NgModule({
    imports: [PublicRouterModule, SharedModule],
    declarations: [FaqsComponent, LockoutComponent, NotFoundComponent, AccessDeniedComponent],
    providers: [LogService],
})
export class PublicModule {
    static forRoot(): ModuleWithProviders<PublicModule> {
        return {
            ngModule: PublicModule,
        };
    }
}
