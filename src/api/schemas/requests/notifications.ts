import { PaginationQueryParamsSchema } from "./common";
import { NotificationsStatusStrings } from "../../../modules/Notifications/utils/notificationsEnum";

export interface FilterNotificationsParamsSchema extends PaginationQueryParamsSchema {
    status?: NotificationsStatusStrings;
}
