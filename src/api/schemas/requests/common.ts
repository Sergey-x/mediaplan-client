import { ProgressStatusStrings } from "../../../enums/progressEnum";

export interface FilterDateRangeQueryParamsSchema {
    from?: string;
    to?: string;
}

export interface PaginationQueryParamsSchema {
    pageNumber?: number;
    entitiesCount?: number;
}

export interface FilterByReadyStatusParamsSchema {
    status?: ProgressStatusStrings | undefined;
}
