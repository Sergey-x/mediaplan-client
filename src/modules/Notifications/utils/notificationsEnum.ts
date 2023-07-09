export enum NotificationsStatusEnum {
    READ = "READ",
    UNREAD = "UNREAD",
}

export type NotificationsStatusStrings = (typeof NotificationsStatusEnum)[keyof typeof NotificationsStatusEnum];
