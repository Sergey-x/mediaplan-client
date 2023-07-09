import { ProcessSortByStrings } from "../../../enums/processEnums";
import { ProgressStatusStrings } from "../../../enums/progressEnum";
import { FilterByReadyStatusParamsSchema, PaginationQueryParamsSchema } from "./common";

/**
 * Схема создания нового процесса.
 * */
export interface CreateProcessRequestSchema {
    name: string;
    description?: string;
    endDate?: Date | string | null | undefined;
    color?: string;
}

/**
 * Схема изменения процесса.
 * */
export interface EditProcessRequestSchema {
    processId: number;
    name?: string;
    description?: string;
    endDate?: Date | string | null | undefined;
    color?: string;
    status?: ProgressStatusStrings;
}

export interface ProcessRequestQueryParamSchema extends PaginationQueryParamsSchema, FilterByReadyStatusParamsSchema {
    sortBy: ProcessSortByStrings;
}
