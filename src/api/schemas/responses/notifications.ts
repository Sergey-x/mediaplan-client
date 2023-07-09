import { NotificationsStatusStrings } from "../../../modules/Notifications/utils/notificationsEnum";
import { PaginationResponseSchema } from "./common";

export interface GetNotificationsResponseSchema extends PaginationResponseSchema {
    notifications: Array<NotificationsResponseItemSchema>;
}

export interface NotificationsResponseItemSchema {
    id: number;
    taskId?: number;
    eventId?: number;
    recipientId: number;
    message: string;
    status: NotificationsStatusStrings;
    creationTime: string;
}
