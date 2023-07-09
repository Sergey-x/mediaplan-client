import { CreateUnitRequestSchema, UpdateTeamRequestSchema } from "../schemas/requests/units";
import {
    CreateUnitsResponseSchema,
    GetAllUnitsResponseSchema,
    UnitResponseItemSchema,
} from "../schemas/responses/units";
import requestApi from "../fetchApi";

/**
 * Класс с методами доступа к api отделов.
 * */
export class UnitsApi {
    static apiPrefix = "/schedule/department";

    /**
     * Получить все отделы.
     * */
    static async all(): Promise<UnitResponseItemSchema[]> {
        return requestApi.GET(`${this.apiPrefix}`).then((data: GetAllUnitsResponseSchema) => {
            return data.departments;
        });
    }

    /**
     * Получить отдел с указанным `id`.
     *
     * @param id - Идентификатор отдела
     * */
    static async getById(id: number): Promise<UnitResponseItemSchema> {
        return requestApi.GET(`${this.apiPrefix}/${id}`);
    }

    /**
     * Создать новый отдел.
     *
     * @param data - Объект с данными отдела
     * */
    static async createUnit(data: CreateUnitRequestSchema): Promise<CreateUnitsResponseSchema> {
        return requestApi.POST(`${this.apiPrefix}`, { body: data });
    }

    /**
     * Обновить информацию об отделе.
     *
     * @param data - Объект с новыми данными отдела
     * */
    static update(data: UpdateTeamRequestSchema) {
        return requestApi.PATCH(`${this.apiPrefix}`, { body: data });
    }

    /**
     * Удалить отдел.
     *
     * @param id - Идентификатор отдела.
     * */
    static delete(id: number): Promise<void> {
        return requestApi.DELETE(`${this.apiPrefix}/${id}`);
    }
}
