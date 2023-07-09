import { ProgressStatusStrings } from "../../../enums/progressEnum";
import {
    FilterByReadyStatusParamsSchema,
    FilterDateRangeQueryParamsSchema,
    PaginationQueryParamsSchema,
} from "./common";

/**
 * Схема создания нового события.
 * */
export interface CreateEventRequestSchema {
    name: string;
    description?: string;
    endDate?: Date;
    color?: string;
}

/**
 * Схема изменения события.
 * */
export interface EditEventRequestSchema {
    eventId: number;
    name?: string;
    description?: string;
    endDate?: Date | string;
    color?: string;
    status?: ProgressStatusStrings;
}

export interface FilterEventsParamsSchema
    extends FilterDateRangeQueryParamsSchema,
        FilterByReadyStatusParamsSchema,
        PaginationQueryParamsSchema {
    events?: number[] | undefined;
}
