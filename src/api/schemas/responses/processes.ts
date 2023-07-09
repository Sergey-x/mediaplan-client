import { ProgressStatusStrings } from "../../../enums/progressEnum";
import { FileResponseItemSchema } from "./files";
import { PaginationResponseSchema } from "./common";

/**
 * Схема ответа на запрос получения списка процесса.
 * */
export interface GetProcessesResponseSchema extends PaginationResponseSchema {
    processes: ProcessResponseItemSchema[];
}

/**
 * Схема данных процесса, используется для типизации в коде компонентов в том числе.
 * */
export interface ProcessResponseItemSchema {
    id: number;
    name: string;
    description: string;
    color: string;
    endDate: string | Date | undefined | null;
    status: ProgressStatusStrings;
    files?: FileResponseItemSchema[] | undefined | null;
}
