import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NotificationService } from "../notifications/notification.service";
import { NotificationViewModel } from "@shared/models/notificationViewModel";
import { StatusEnum } from "@shared/models/enums/statusEnum";
import { ApiBadRequestResponse } from "@shared/models/apiBadRequestResponse";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-notification-popup",
    templateUrl: "./notification-popup.component.html",
    styleUrls: ["./notification-popup.component.scss"],
})
export class NotificationPopupComponent implements OnInit {
    faTimes = faTimes;
    @Input() notificationDetail: NotificationViewModel;
    @Output() handleUpdatedNotification: EventEmitter<NotificationViewModel> = new EventEmitter();
    @Output() handleNotificationAdded: EventEmitter<NotificationViewModel> = new EventEmitter();
    showSpinner = false;
    addSpinner = false;
    private debug = false;
    modelErrors = new Array<string>();
    constructor(
        public activeModal: NgbActiveModal,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.showSpinner = true;

        if (this.debug) console.log("ngOnInit notification modal");
        //need to make a call to mark message as read.
        this.markNotificationAsRead();
    }

    ngOnDestroy(): void {}

    close(res: string) {
        this.activeModal.close();
    }

    addCredential() {
        this.addSpinner = true;
        // Make the API call to update the notification on the server here
        this.notificationService.addCredential(this.notificationDetail).subscribe(data => {
            if (this.debug) console.log("addCredential", data);

            if (data.statusCode == 200) {
                const notificationToRemove = {
                    ...this.notificationDetail,
                };

                this.handleNotificationAdded.emit(notificationToRemove);
                this.close("close");
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
            this.addSpinner = false;
        });
    }

    private markNotificationAsRead() {
        // Make the API call to update the notification on the server here
        this.notificationService.markAsRead(this.notificationDetail).subscribe(data => {
            if (this.debug) console.log("markNotificationAsRead", data);

            if (data.statusCode == 200) {
                const updatedNotification = {
                    ...this.notificationDetail,
                    status: StatusEnum.Read,
                };

                this.handleUpdatedNotification.emit(updatedNotification);
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
        });
    }

    markNotificationAsUnread() {
        // Make the API call to update the notification on the server here
        this.notificationService.markAsUnread(this.notificationDetail).subscribe(data => {
            if (this.debug) console.log("markNotificationAsUnread", data);

            if (data.statusCode == 200) {
                const updatedNotification = {
                    ...this.notificationDetail,
                    status: StatusEnum.Unread,
                };

                this.handleUpdatedNotification.emit(updatedNotification);
                this.close("close");
            } else {
                this.modelErrors = (<ApiBadRequestResponse>data).errors;
            }
        });
    }
}
