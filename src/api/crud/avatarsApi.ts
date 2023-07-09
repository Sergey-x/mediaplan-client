import requestApi from "../fetchApi";
import { FileOwnerTypesEnum } from "../../enums/filesEnums";

export class AvatarsApi {
    static apiPrefix: string = "/files";

    /**
     * Установить аватар пользователя.
     *
     * @param id - Идентификатор пользователя
     * @param avatarImage - Идентификатор пользователя
     * */
    static async set(id: number, avatarImage: string | Blob | File) {
        let formData = new FormData();
        formData.append("file", avatarImage);

        return await requestApi.POST_FILE(`${this.apiPrefix}/add/${FileOwnerTypesEnum.USER}/${id}`, {
            method: "POST",
            body: formData,
        });
    }

    /**
     * Удалить аватар пользователя.
     *
     * @param id - Идентификатор пользователя
     * */
    static async delete(id: number) {
        return await requestApi.DELETE(`${this.apiPrefix}/${FileOwnerTypesEnum.USER}/${id}`);
    }
}
