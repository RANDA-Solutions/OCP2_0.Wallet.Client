import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LimitTextComponent } from "./components/limit-text/limit-text.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { PasswordRequirementsComponent } from "./components/password-requirements/password-requirements.component";
import { ScreenSizeComponent } from "./components/screen-size/screen-size.component";
import { DisableControlDirective } from "./directives/disable-control.directive";
import { NotificationPopupComponent } from "./components/notification-popup/notification-popup.component";
import { EvidencePopupComponent } from "./components/evidence-popup/evidence-popup.component";
import { PhoneNumberPipe } from "../pipes/phone-number.pipe";
import { CollectionCardComponent } from "./components/collection-card/collection-card.component";
import { ShareHistoryCardComponent } from "./components/share-history-card/share-history-card.component";
import { CredentialCardComponent } from "./components/credential-card/credential-card.component";
import { PaginationService } from "./components/pagination/pagination.service";
import { CollectionDeletePopupComponent } from "./components/collection-delete-popup/collection-delete-popup.component";
import { CredentialDeletePopupComponent } from "./components/credential-delete-popup/credential-delete-popup.component";
import { ProfileService } from "./components/profile/profile.service";
import { ProfileComponent } from "./components/profile/profile.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    imports: [CommonModule, RouterModule, NgbModule, FontAwesomeModule],
    declarations: [
        //InterceptSubmitDirective,
        DashboardComponent,
        DisableControlDirective,
        LimitTextComponent,
        NotificationsComponent,
        PaginationComponent,
        PasswordRequirementsComponent,
        PhoneNumberPipe,
        ProfileComponent,
        ScreenSizeComponent,
        SpinnerComponent,
        NotificationPopupComponent,
        EvidencePopupComponent,
        CredentialCardComponent,
        CredentialDeletePopupComponent,
        CollectionCardComponent,
        CollectionDeletePopupComponent,
        ShareHistoryCardComponent,
        CredentialCardComponent,
    ],
    exports: [
        //InterceptSubmitDirective,
        CommonModule,
        DashboardComponent,
        DisableControlDirective,
        /* https://angular.io/guide/sharing-ngmodules
       Even though the components declared by SharedModule might not bind with [(ngModel)] and there may be no need for
       SharedModule to import FormsModule, SharedModule can still export FormsModule without listing it among its imports.
       This way, you can give other modules access to FormsModule without having to import it directly into the @NgModule decorator. */
        FormsModule,
        LimitTextComponent,
        NotificationsComponent,
        PaginationComponent,
        PasswordRequirementsComponent,
        PhoneNumberPipe,
        ProfileComponent,
        NgbModule,
        ReactiveFormsModule,
        ScreenSizeComponent,
        SpinnerComponent,
        CredentialCardComponent,
        EvidencePopupComponent,
        CredentialDeletePopupComponent,
        CollectionCardComponent,
        CollectionDeletePopupComponent,
        ShareHistoryCardComponent,
        CredentialCardComponent,
    ],
    providers: [PaginationService, ProfileService],
})
export class SharedModule {}
