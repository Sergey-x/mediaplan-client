import { ProgressStatusStrings } from "../../../enums/progressEnum";
import { FileResponseItemSchema } from "./files";
import { PaginationResponseSchema } from "./common";

/**
 * Схема ответа на запрос получения списка событий.
 * */
export interface GetEventsResponseSchema extends PaginationResponseSchema {
    events: EventResponseItemSchema[];
}

/**
 * Схема данных события, используется для типизации в коде компонентов в том числе.
 * */
export interface EventResponseItemSchema {
    id: number;
    name: string;
    description: string;
    color: string;
    endDate: string | Date;
    status: ProgressStatusStrings;
    files?: FileResponseItemSchema[] | undefined | null;
}
