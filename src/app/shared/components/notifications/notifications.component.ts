import { Component, OnInit, ViewChild } from "@angular/core";
import { StatusEnum } from "@shared/models/enums/statusEnum";
import { ApiOkResult } from "@shared/models/apiOkResponse";
import { environment } from "@environment/environment";
import { NotificationService } from "./notification.service";
import { NotificationViewModel } from "@shared/models/notificationViewModel";
import { NgbActiveModal, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { NotificationPopupComponent } from "../notification-popup/notification-popup.component";
import { MessageService } from "primeng/api";
import { ProfileService } from "../profile/profile.service";
import { faEnvelopeOpen, faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-notifications-component",
    templateUrl: "./notifications.component.html",
    styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements OnInit {
    faEnvelopeOpen = faEnvelopeOpen;
    faArrowRight = faArrowRight;
    faEnvelope = faEnvelope;
    @ViewChild("notificationDetailsModal", { static: false }) private notificationDetailsModal;

    notifications: NotificationViewModel[] = [];
    activeModal: NgbActiveModal;
    private debug = false;
    environment = environment;
    modalNotification: NotificationViewModel;

    constructor(
        private modalService: NgbModal,
        private notificationService: NotificationService,
        private messageService: MessageService,
        private profileService: ProfileService
    ) {}

    ngOnInit() {
        if (this.debug) console.log(`NotificationsComponent ngOnInit`);

        this.getData();
    }

    ngOnDestroy(): void {}

    getData(): any {
        if (this.debug) console.log("NotificationsComponent getData");

        this.notificationService.getNotifications().subscribe(data => {
            if (this.debug) console.log(data);
            if (data.statusCode == 200) {
                this.notifications = (<ApiOkResult<NotificationViewModel[]>>data).result;
            } else {
                this.notifications = [];
            }
        });
    }

    handleUpdatedNotification(updatedNotification: NotificationViewModel) {
        if (this.debug) console.log("NotificationsComponent handleUpdatedNotification", updatedNotification);

        const index = this.notifications.findIndex(n => n.notificationId === updatedNotification.notificationId);
        if (index !== -1) {
            this.notifications[index] = updatedNotification;
        }
    }

    handleNotificationAdded(notificationToRemove: NotificationViewModel) {
        if (this.debug) console.log("NotificationsComponent handleNotificationAdded", notificationToRemove);

        const index = this.notifications.findIndex(n => n.notificationId === notificationToRemove.notificationId);
        if (index !== -1) {
            this.notifications.splice(index, 1);
            this.profileService.refreshProfile();
        }
        this.messageService.add({
            key: "main",
            severity: "success",
            summary: "Success Message",
            detail: "Credential Added.",
        });
    }

    open(notification: NotificationViewModel) {
        let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: true,
            centered: true,
            ariaLabelledBy: "modal-basic-title",
        };

        const modalRef = this.modalService.open(NotificationPopupComponent, ngbModalOptions);
        modalRef.componentInstance.notificationDetail = notification;
        modalRef.componentInstance.handleUpdatedNotification.subscribe(
            (handleUpdatedNotification: NotificationViewModel) => {
                this.handleUpdatedNotification(handleUpdatedNotification);
            }
        );

        modalRef.componentInstance.handleNotificationAdded.subscribe(
            (handleNotificationAdded: NotificationViewModel) => {
                this.handleNotificationAdded(handleNotificationAdded);
            }
        );
    }

    isRead(notification: NotificationViewModel): boolean {
        return notification.status === StatusEnum.Read;
    }

    getTitle(notification: NotificationViewModel) {
        return `New Certification Offer from - ${notification.issuerName}`;
    }
}
