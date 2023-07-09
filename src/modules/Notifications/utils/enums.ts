export enum NotificationFilterEnum {
    ALL = "ALL", // показать все
    UNREAD = "UNREAD", // показать только непрочитанные
    READ = "READ", // показать только прочитанные
}

export type NotificationFilterStrings = (typeof NotificationFilterEnum)[keyof typeof NotificationFilterEnum];
