import { UserSchema } from "../api/schemas/responses/users";
import { UnitResponseItemSchema } from "../api/schemas/responses/units";
import { TaskResponseItemSchema } from "../api/schemas/responses/tasks";
import { EventResponseItemSchema } from "../api/schemas/responses/events";
import { ProgressStatusEnum } from "../enums/progressEnum";
import { CommentResponseItemSchema } from "../api/schemas/responses/comments";
import { ProcessResponseItemSchema } from "../api/schemas/responses/processes";

const user1: UserSchema = {
    avatar: "",
    id: 1,
    firstName: "Name",
    lastName: "Secondname",
    patronymic: "Lastname",
    email: "",
    creationDate: new Date(),
};

const user2: UserSchema = {
    avatar: "",
    id: 2,
    firstName: "Name",
    lastName: "Secondname",
    patronymic: "Lastname",
    email: "",
    creationDate: new Date(),
};
const user3: UserSchema = {
    avatar: "",
    id: 3,
    firstName: "Name",
    lastName: "Secondname",
    patronymic: "Lastname",
    email: "",
    creationDate: new Date(),
};

const user4: UserSchema = {
    avatar: "",
    id: 4,
    firstName: "Name",
    lastName: "Secondname",
    patronymic: "Lastname",
    email: "",
    creationDate: new Date(),
};

export const usersData: UserSchema[] = [user1, user2, user3, user4];

export const unitsData: UnitResponseItemSchema[] = [
    {
        id: 1,
        name: "Отдел социальных медиа",
        description: "Описание",
        admin: user1,
        color: "",
        creationDate: new Date().toJSON(),
        members: [],
    },
    {
        id: 2,
        name: "Отдел социальных медиа",
        description: "Описание",
        admin: user1,
        color: "",
        creationDate: new Date().toJSON(),
        members: [],
    },
    {
        id: 3,
        name: "Отдел социальных медиа",
        description: "Описание",
        admin: user1,
        color: "",
        creationDate: new Date().toJSON(),
        members: [],
    },
];

export const taskData: TaskResponseItemSchema = {
    id: 1,
    name: "Задача 3",
    description: "расширенное описание",
    taskStatus: ProgressStatusEnum.IN_PROGRESS,
    expirationTime: new Date().toJSON(),
    assignee: [user1],
    author: user2,
    event: {
        id: 1,
        name: "Событие 1",
        color: "#ff0864",
        description: "desc",
        endDate: new Date().toJSON(),
        status: ProgressStatusEnum.IN_PROGRESS,
        files: [],
    },
    department: unitsData[0],
    files: [],
};

export const tasksData: TaskResponseItemSchema[] = [
    {
        id: 1,
        name: "Задача 1",
        description: "расширенное описание",
        taskStatus: ProgressStatusEnum.IN_PROGRESS,
        expirationTime: new Date().toJSON(),
        assignee: [user1],
        author: user2,
        event: {
            id: 1,
            name: "Событие 1",
            color: "#ff0864",
            description: "desc",
            endDate: new Date().toJSON(),
            status: ProgressStatusEnum.IN_PROGRESS,
            files: [],
        },
        department: unitsData[1],
        files: [],
    },
    {
        id: 2,
        name: "Задача 2",
        description: "расширенное описание",
        taskStatus: ProgressStatusEnum.IN_PROGRESS,
        expirationTime: new Date().toJSON(),
        assignee: [user1],
        author: user2,
        event: {
            id: 1,
            name: "Событие 1",
            color: "#ff0864",
            description: "desc",
            endDate: new Date().toJSON(),
            status: ProgressStatusEnum.IN_PROGRESS,
            files: [],
        },
        department: unitsData[0],
        files: [],
    },
    {
        id: 3,
        name: "Задача 3",
        description: "расширенное описание",
        taskStatus: ProgressStatusEnum.COMPLETED,
        expirationTime: new Date().toJSON(),
        assignee: [user1],
        author: user2,
        event: {
            id: 1,
            name: "Событие 1",
            color: "#ff0864",
            description: "desc",
            endDate: new Date().toJSON(),
            status: ProgressStatusEnum.IN_PROGRESS,
            files: [],
        },
        department: unitsData[0],
        files: [],
    },
];

export const eventsData: EventResponseItemSchema[] = [
    {
        id: 1,
        name: "Событие 1",
        color: "#ff0864",
        description: "desc",
        endDate: new Date().toJSON(),
        status: ProgressStatusEnum.IN_PROGRESS,
        files: [],
    },
    {
        id: 2,
        name: "Событие 2",
        color: "#2aad6b",
        description: "desc",
        endDate: new Date().toJSON(),
        status: ProgressStatusEnum.IN_PROGRESS,
        files: [],
    },
    {
        id: 3,
        name: "Событие 3",
        color: "#bd8c11",
        description: "desc",
        endDate: new Date().toJSON(),
        status: ProgressStatusEnum.COMPLETED,
        files: [],
    },
];

export const testCommentsData: CommentResponseItemSchema[] = [
    {
        id: 1,
        author: user1,
        comment: "lorem",
        createdAt: new Date().toJSON(),
    },
    {
        id: 2,
        author: user2,
        comment: "lorem2",
        createdAt: new Date().toJSON(),
    },
];

export const processList: ProcessResponseItemSchema[] = [
    {
        id: 1,
        name: "Процесс 1",
        color: "",
        files: [],
        description: "Описание",
        endDate: new Date(),
        status: ProgressStatusEnum.IN_PROGRESS,
    },
    {
        id: 2,
        name: "Процесс 2",
        color: "",
        files: [],
        description: "Описание 2",
        endDate: new Date(),
        status: ProgressStatusEnum.COMPLETED,
    },
];
