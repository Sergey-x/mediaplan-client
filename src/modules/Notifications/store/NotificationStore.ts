import { autorun, makeAutoObservable } from "mobx";
import {
    GetNotificationsResponseSchema,
    NotificationsResponseItemSchema,
} from "../../../api/schemas/responses/notifications";
import { API } from "../../../api/api";
import { NotificationsStatusEnum, NotificationsStatusStrings } from "../utils/notificationsEnum";
import { NotificationFilterEnum, NotificationFilterStrings } from "../utils/enums";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import authUserStore from "../../../store/AuthUserStore";
import PaginatedList from "../../../utils/pagination";
import { PaginationQueryParamsSchema } from "../../../api/schemas/requests/common";

function getOppositeStatus(toggledStatus: NotificationsStatusStrings): NotificationsStatusStrings {
    return toggledStatus === NotificationsStatusEnum.READ
        ? NotificationsStatusEnum.UNREAD
        : NotificationsStatusEnum.READ;
}

function removeById(notifications: NotificationsResponseItemSchema[], id: number): NotificationsResponseItemSchema[] {
    return notifications.filter((notification) => notification.id !== id);
}

function compareNotification(a: NotificationsResponseItemSchema, b: NotificationsResponseItemSchema): number {
    // Сначала новые
    return b.id - a.id;
}

function getStatusFromFilter(filter: NotificationFilterStrings): NotificationsStatusStrings | undefined {
    if (filter === NotificationFilterEnum.READ) return NotificationsStatusEnum.READ;
    if (filter === NotificationFilterEnum.UNREAD) return NotificationsStatusEnum.UNREAD;
    return undefined;
}

const NotificationRequestPeriodMS: number = 30000;
export const MaxUnreadNotifications: number = 30;

class NotificationStore {
    private fetchStatus: FetchStatusStrings = FetchStatusEnum.IDLE;
    private filterValue: NotificationFilterStrings = NotificationFilterEnum.UNREAD;
    private unreadNotifications: NotificationsResponseItemSchema[] = [];

    // Введомления согласно фильтру
    private paginatedNotifications: PaginatedList<NotificationsResponseItemSchema, GetNotificationsResponseSchema> =
        new PaginatedList(
            (params: PaginationQueryParamsSchema) => {
                return API.notifications.fetch({
                    ...params,
                    status: getStatusFromFilter(this.getFilterValue),
                });
            },
            (result: GetNotificationsResponseSchema): NotificationsResponseItemSchema[] => {
                return result.notifications;
            }
        );

    constructor() {
        makeAutoObservable(this);
        this.initStore();
        this.fetchUnread();

        // Опрос сервера на непрочитанные опопвещения каждые `NotificationRequestPeriodMS` секунд
        autorun(
            () => {
                this.fetchUnread();
            },
            { scheduler: (run) => setInterval(run, NotificationRequestPeriodMS) }
        );
    }

    initStore(): void {
        console.log("Notification global store initialized");
    }

    get getFilterValue(): NotificationFilterStrings {
        return this.filterValue;
    }

    setFilterValue(newFilterValue: NotificationFilterStrings): void {
        this.filterValue = newFilterValue;
    }

    get getFetchStatus(): FetchStatusStrings {
        return this.paginatedNotifications.getRequestStatus();
    }

    get getPageNotifications(): NotificationsResponseItemSchema[] {
        return this.paginatedNotifications.getObjectList();
    }

    get getUnread(): NotificationsResponseItemSchema[] {
        return this.unreadNotifications;
    }

    private setUnread(notifications: NotificationsResponseItemSchema[]): void {
        this.unreadNotifications = notifications;
    }

    toggleNotificationStatus(toggledNotification: NotificationsResponseItemSchema) {
        const newStatus: NotificationsStatusStrings = getOppositeStatus(toggledNotification.status);
        toggledNotification.status = newStatus;

        if (newStatus === NotificationsStatusEnum.UNREAD) {
            const newUnread = [...this.getUnread, toggledNotification];
            newUnread.sort(compareNotification);
            this.setUnread(newUnread);

            if (this.getFilterValue === NotificationFilterEnum.UNREAD) {
                const newObjects = [...this.paginatedNotifications.getObjectList(), toggledNotification];
                newObjects.sort(compareNotification);
                this.paginatedNotifications.setObjectList(newObjects);
            } else {
                this.paginatedNotifications.setObjectList(
                    removeById(this.paginatedNotifications.getObjectList(), toggledNotification.id)
                );
            }
        } else {
            this.setUnread(removeById(this.getUnread, toggledNotification.id));

            if (this.getFilterValue === NotificationFilterEnum.READ) {
                const newObjects = [...this.paginatedNotifications.getObjectList(), toggledNotification];
                newObjects.sort(compareNotification);
                this.paginatedNotifications.setObjectList(newObjects);
            } else {
                this.paginatedNotifications.setObjectList(
                    removeById(this.paginatedNotifications.getObjectList(), toggledNotification.id)
                );
            }
        }
    }

    makeAllNotificationsRead(): void {
        this.fetchStatus = FetchStatusEnum.FETCHING;
        API.notifications
            .makeAllNotificationRead()
            .then(() => {
                this.setUnread([]);
                this.fetchStatus = FetchStatusEnum.SUCCESS;
                this.setUnread([]);

                if (this.getFilterValue === NotificationFilterEnum.UNREAD) {
                    // непрочитаннеый оповещения кончились - переключаем на "ВСЕ"
                    this.setFilterValue(NotificationFilterEnum.ALL);
                }
            })
            .catch(() => {
                this.fetchStatus = FetchStatusEnum.ERROR;
            });
    }

    resetPageData(): void {
        this.paginatedNotifications.resetState();
    }

    fetchData(): void {
        if (authUserStore.getMe === undefined) return;

        this.paginatedNotifications.makeRequest();
    }

    fetchUnread(): void {
        if (authUserStore.getMe === undefined) return;

        API.notifications
            .fetch({
                status: NotificationsStatusEnum.UNREAD,
                pageNumber: 0,
                entitiesCount: MaxUnreadNotifications + 1,
            })
            .then((response: GetNotificationsResponseSchema) => {
                this.setUnread(response.notifications);
            });
    }
}

const notificationStore = new NotificationStore();
export default notificationStore;
