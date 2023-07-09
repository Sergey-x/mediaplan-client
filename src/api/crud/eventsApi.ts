import { EventResponseItemSchema, GetEventsResponseSchema } from "../schemas/responses/events";
import { CreateEventRequestSchema, EditEventRequestSchema, FilterEventsParamsSchema } from "../schemas/requests/events";
import requestApi from "../fetchApi";

export class EventsApi {
    static apiPrefix: string = "/schedule/event";

    /**
     * Получить события в заданном диапазоне дат.
     * */
    static async getMany(params: FilterEventsParamsSchema): Promise<GetEventsResponseSchema> {
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
     * Получить событие с указанным `id`.
     *
     * @param id - Идентификатор события
     * */
    static async getById(id: number): Promise<EventResponseItemSchema> {
        return requestApi.GET(`${this.apiPrefix}/${id}`);
    }

    /**
     * Создать новое событие.
     *
     * @param data - Объект с данными события
     * */
    static async createEvent(data: CreateEventRequestSchema): Promise<EventResponseItemSchema> {
        return requestApi.POST(`${this.apiPrefix}`, { body: data });
    }

    /**
     * Изменить событие.
     *
     * @param data - Объект с данными события
     * */
    static async editEvent(data: EditEventRequestSchema): Promise<EventResponseItemSchema> {
        return requestApi.PATCH(`${this.apiPrefix}`, { body: data });
    }

    /**
     * Удалить событие.
     *
     * @param id - Идентификатор события.
     * */
    static delete(id: number): Promise<void> {
        return requestApi.DELETE(`${this.apiPrefix}/${id}`);
    }
}
