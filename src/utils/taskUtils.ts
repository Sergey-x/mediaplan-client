import { TaskResponseItemSchema } from "../api/schemas/responses/tasks";
import { compareDatetime } from "./dateutils";
import { ProgressStatusEnum } from "../enums/progressEnum";

export function compareTasks(a: TaskResponseItemSchema, b: TaskResponseItemSchema): number {
    const byDatetime: number = compareDatetime(new Date(a.expirationTime), new Date(b.expirationTime));
    if (byDatetime) return byDatetime;
    return a.id - b.id;
}

export function getOnlyOpenTasks(tasks: TaskResponseItemSchema[]): TaskResponseItemSchema[] {
    return tasks.filter((task) => task.taskStatus === ProgressStatusEnum.IN_PROGRESS);
}

export function getOnlyCompletedTasks(tasks: TaskResponseItemSchema[]): TaskResponseItemSchema[] {
    return tasks.filter((task) => task.taskStatus === ProgressStatusEnum.COMPLETED);
}
