import requestApi from "../fetchApi";
import { FileOwnerTypesEnum } from "../../enums/filesEnums";
import { FileResponseItemSchema } from "../schemas/responses/files";

export class FilesApi {
    static apiPrefix: string = "/files";

    /**
     * Прикрепить файл.
     *
     * @param id - Идентификатор события
     * @param eventType - Тип события
     * @param file - Прикрепляемый файл
     * */
    static async addFile(id: number, eventType: FileOwnerTypesEnum, file: File): Promise<FileResponseItemSchema[]> {
        const formData: FormData = new FormData();
        formData.append("file", file);

        return await requestApi.POST_FILE(`${this.apiPrefix}/add/${eventType}/${id}`, {
            method: "POST",
            body: formData,
        });
    }

    /**
     * Удалить файл.
     *
     * @param id - Идентификатор удаляемого фалйа
     * */
    static async dropFileById(id: number): Promise<any> {
        return requestApi.DELETE(`${this.apiPrefix}/${id}`);
    }
}
