import { NotificationsResponseItemSchema } from "../api/schemas/responses/notifications";
import { NotificationsStatusEnum } from "../modules/Notifications/utils/notificationsEnum";

export const sampleNotifications: NotificationsResponseItemSchema[] = [
    {
        id: 1,
        message: 'Добавлена новая задача "Задача" к событию "Событие"',
        creationTime: "2023-03-16 12:00",
        status: NotificationsStatusEnum.READ,
        recipientId: 0,
        taskId: 1,
        eventId: 1,
    },
    {
        id: 2,
        message: 'Добавлена новая задача "Задача1" к событию "Событие1"',
        creationTime: "2023-03-16 11:00",
        status: NotificationsStatusEnum.READ,
        recipientId: 0,
        taskId: 1,
        eventId: 1,
    },
    {
        id: 3,
        message: 'Добавлено новое событие "Событие3"',
        creationTime: "2023-03-15 10:00",
        status: NotificationsStatusEnum.UNREAD,
        recipientId: 0,
        taskId: 1,
        eventId: 1,
    },
    {
        id: 4,
        message: 'К задаче "Задача3" прикреплены файлы 1.docx, file.pdf и prs.pptx',
        creationTime: "2023-03-16 15:00",
        status: NotificationsStatusEnum.READ,
        recipientId: 0,
        taskId: 1,
        eventId: 1,
    },
    {
        id: 5,
        message: 'Проверьте задачу "Задача5"',
        creationTime: "2023-03-17 11:00",
        status: NotificationsStatusEnum.UNREAD,
        recipientId: 0,
        taskId: 1,
        eventId: 1,
    },
];
