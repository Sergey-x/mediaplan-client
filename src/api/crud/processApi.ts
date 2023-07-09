import requestApi from "../fetchApi";
import { GetProcessesResponseSchema, ProcessResponseItemSchema } from "../schemas/responses/processes";
import {
    CreateProcessRequestSchema,
    EditProcessRequestSchema,
    ProcessRequestQueryParamSchema,
} from "../schemas/requests/processes";

export class ProcessApi {
    static apiPrefix: string = "/schedule/process";

    /**
     * Получить все процессы.
     * */
    static async getMany(params: ProcessRequestQueryParamSchema): Promise<GetProcessesResponseSchema> {
        const filteredParams: object = Object.fromEntries(
            Object.entries(params).filter((pair) => pair[1] !== undefined)
        );

        return (
            requestApi
                // @ts-ignore
                .GET(`${this.apiPrefix}?` + new URLSearchParams(filteredParams).toString())
        );
    }

    /**
     * Получить процесс с указанным `id`.
     *
     * @param id - Идентификатор процесса
     * */
    static async getById(id: number): Promise<ProcessResponseItemSchema> {
        return requestApi.GET(`${this.apiPrefix}/${id}`);
    }

    /**
     * Создать новый процесс.
     *
     * @param data - Объект с данными процесса
     * */
    static async create(data: CreateProcessRequestSchema): Promise<ProcessResponseItemSchema> {
        return requestApi.POST(`${this.apiPrefix}`, { body: data });
    }

    /**
     * Изменить процесс.
     *
     * @param data - Объект с данными процесса
     * */
    static async edit(data: EditProcessRequestSchema): Promise<ProcessResponseItemSchema> {
        return requestApi.PATCH(`${this.apiPrefix}`, { body: data });
    }

    /**
     * Удалить процесс.
     *
     * @param id - Идентификатор процесса
     * */
    static delete(id: number): Promise<void> {
        return requestApi.DELETE(`${this.apiPrefix}/${id}`);
    }
}
