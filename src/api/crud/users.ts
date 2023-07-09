import { UpdateUserInfoRequestSchema } from "../schemas/requests/users";
import { GetAllUsersResponseSchema, UserSchema } from "../schemas/responses/users";
import requestApi from "../fetchApi";

export class users {
    static apiPrefix = "/schedule/user";

    static async all(): Promise<UserSchema[]> {
        return requestApi.GET(`${this.apiPrefix}`).then((data: GetAllUsersResponseSchema) => {
            return data.users;
        });
    }

    static async getMe(): Promise<UserSchema> {
        return requestApi.GET(`${users.apiPrefix}/me`);
    }

    static async updateUserInfo(userId: number, data: UpdateUserInfoRequestSchema) {
        return await requestApi.PUT(`${this.apiPrefix}`, { body: data });
    }
}
