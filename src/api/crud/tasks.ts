import { CreateTaskRequestSchema, FilterTasksParamsSchema, UpdateTaskRequestSchema } from "../schemas/requests/tasks";
import requestApi from "../fetchApi";
import { GetTasksResponseSchema, TaskResponseItemSchema } from "../schemas/responses/tasks";

export class tasks {
    static apiPrefix = "/schedule/task";

    static createTask(data: CreateTaskRequestSchema): Promise<TaskResponseItemSchema> {
        return requestApi.POST(`${this.apiPrefix}`, { body: data });
    }

    static async getTasks(params: FilterTasksParamsSchema): Promise<TaskResponseItemSchema[]> {
        const filteredParams: object = Object.fromEntries(
            Object.entries(params).filter((pair) => pair[1] !== undefined)
        );
        return (
            requestApi
                // @ts-ignore
                .GET(`${this.apiPrefix}?` + new URLSearchParams(filteredParams).toString())
                .then((data: GetTasksResponseSchema) => {
                    return data.tasks;
                })
        );
    }

    static async getTaskById(id: number): Promise<TaskResponseItemSchema> {
        return requestApi.GET(`${this.apiPrefix}/${id}`);
    }

    static async updateTaskById(data: UpdateTaskRequestSchema): Promise<TaskResponseItemSchema> {
        return requestApi.PATCH(`${this.apiPrefix}`, { body: data });
    }

    /**
     * Удалить задачу.
     *
     * @param id - Идентификатор задачи.
     * */
    static delete(id: number): Promise<void> {
        return requestApi.DELETE(`${this.apiPrefix}/${id}`);
    }
}
