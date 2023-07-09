import requestApi from "../fetchApi";
import { GetNotificationsResponseSchema, NotificationsResponseItemSchema } from "../schemas/responses/notifications";
import { NotificationsStatusStrings } from "../../modules/Notifications/utils/notificationsEnum";
import { FilterNotificationsParamsSchema } from "../schemas/requests/notifications";

/**
 * Класс с методами доступа к api оповещений.
 * */
export class NotificationsApi {
    static apiPrefix = "/schedule/notification";

    /**
     * Получить оповещение с указанным идентификатором.
     *
     * @param id - Идентификатор оповещения
     * */
    static async getById(id: number | string): Promise<NotificationsResponseItemSchema> {
        return requestApi.GET(`${this.apiPrefix}/${id}`).then((data: NotificationsResponseItemSchema) => {
            return data;
        });
    }

    /**
     * Получить оповещения (есть пагинация) с определенным статусом.
     * */
    /**
     * Получить оповещения (есть пагинация) с определенным статусом.
     * */
    static async fetch(params: FilterNotificationsParamsSchema): Promise<GetNotificationsResponseSchema> {
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
     * Отметить оповещение c указанным `id` прочитанным.
     *
     * @param id - Идентификатор оповещения
     * @param status - Новый статус оповещения
     * */
    static async changeNotificationStatus(id: number | string, status: NotificationsStatusStrings): Promise<any> {
        return requestApi.PATCH(`${this.apiPrefix}/${id}?status=${status}`);
    }

    /**
     * Отметить все оповещения прочитанными.
     * */
    static async makeAllNotificationRead(): Promise<void> {
        return requestApi.PATCH(`${this.apiPrefix}/read-all`);
    }
}
