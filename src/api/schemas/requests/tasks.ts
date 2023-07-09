import { ProgressStatusStrings } from "../../../enums/progressEnum";
import { CalendarElemTypeStrings } from "../../../enums/common";
import { FilterDateRangeQueryParamsSchema } from "./common";

export interface CreateTaskRequestSchema {
    name: string;
    description?: string;
    departmentId?: number;
    processId?: number;
    eventId?: number;
    assigneeIds?: number[];
    expirationTime?: Date;
}

export interface UpdateTaskRequestSchema {
    assigneeIds?: number[];
    taskId: number;
    eventId?: number;
    departmentId?: number;
    name?: string;
    description?: string;
    expirationTime?: Date;
    status?: ProgressStatusStrings;
}

export interface FilterTasksParamsSchema extends FilterDateRangeQueryParamsSchema {
    departments?: number[];
    processes?: number[];
    assignee?: number[];
    events?: number[];
    status?: ProgressStatusStrings;
    type?: CalendarElemTypeStrings;
}
