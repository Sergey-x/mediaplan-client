export enum CalendarElemTypeEnum {
    TASK = "TASK",
    EVENT = "EVENT",
    ALL = "",
}

export type CalendarElemTypeStrings = (typeof CalendarElemTypeEnum)[keyof typeof CalendarElemTypeEnum];

export enum StatusFilterEnum {
    All = 0,
    InProgress = 1,
    Done = 2,
}

export type StatusFilterStrings = (typeof StatusFilterEnum)[keyof typeof StatusFilterEnum];

export const StatusFilters: Array<[string, string]> = [
    [StatusFilterEnum.All.toString(), "Все"],
    [StatusFilterEnum.InProgress.toString(), "Активные"],
    [StatusFilterEnum.Done.toString(), "Завершенные"],
];
