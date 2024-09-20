import { StatusEnum } from "./enums/statusEnum";

export class NotificationViewModel {
  notificationId: number;
  issuerName: string;
  issuerImage: string;
  name: string;
  description: string;
  achievementCount: number;
  status: StatusEnum;
  date: Date
}
