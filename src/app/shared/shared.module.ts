import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PhoneNumberPipe } from "../pipes/phone-number.pipe";
import { CollectionCardComponent } from "./components/collection-card/collection-card.component";
import { CollectionDeletePopupComponent } from "./components/collection-delete-popup/collection-delete-popup.component";
import { CredentialAssociationPopupComponent } from "./components/credential-association-popup/credential-association-popup.component";
import { CredentialCardComponent } from "./components/credential-card/credential-card.component";
import { CredentialDeletePopupComponent } from "./components/credential-delete-popup/credential-delete-popup.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { EvidencePopupComponent } from "./components/evidence-popup/evidence-popup.component";
import { LimitTextComponent } from "./components/limit-text/limit-text.component";
import { NotificationPopupComponent } from "./components/notification-popup/notification-popup.component";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { PaginationService } from "./components/pagination/pagination.service";
import { PasswordRequirementsComponent } from "./components/password-requirements/password-requirements.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ProfileService } from "./components/profile/profile.service";
import { ScreenSizeComponent } from "./components/screen-size/screen-size.component";
import { ShareHistoryCardComponent } from "./components/share-history-card/share-history-card.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { DisableControlDirective } from "./directives/disable-control.directive";

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
        CredentialAssociationPopupComponent
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
