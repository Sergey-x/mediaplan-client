/**
 * Enum для типов объектов, к которым могут прикреплятся файлы.
 *
 * TASK, EVENT, PROCESS - для файлов задачи, события или процесса соответственно.
 * USER - файл аватарка пользователя.
 * */
export enum FileOwnerTypesEnum {
    EVENT = "EVENT",
    TASK = "TASK",
    USER = "USER",
    PROCESS = "PROCESS",
}

export type EventTypesStrings = (typeof FileOwnerTypesEnum)[keyof typeof FileOwnerTypesEnum];
