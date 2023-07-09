/*
 * Статусы завершения задач, событий, процессов
 * */
export enum ProgressStatusEnum {
    COMPLETED = "COMPLETED",
    IN_PROGRESS = "IN_PROGRESS",
    ANY = "",
}

export type ProgressStatusStrings = (typeof ProgressStatusEnum)[keyof typeof ProgressStatusEnum];
