import {
    CreateNewPasswordRequestSchema,
    ResetPasswordEmailRequestSchema,
    SignInRequestSchema,
    SignUpRequestSchema,
} from "../schemas/requests/auth";
import requestApi from "../fetchApi";

export class AuthApi {
    static baseUrl: string = "jwt";
    static regUrl: string = "/user/registration";

    static async signIn(data: SignInRequestSchema): Promise<any> {
        return requestApi.POST(`/jwt/obtain`, {
            body: data,
        });
    }

    static async signUp(data: SignUpRequestSchema): Promise<any> {
        return requestApi.POST(`${this.regUrl}`, {
            body: data,
        });
    }

    static async sendResetPswEmail(data: ResetPasswordEmailRequestSchema): Promise<any> {
        return requestApi.POST("/user/registration/restore-access", {
            body: data,
        });
    }

    static createNewPassword(data: CreateNewPasswordRequestSchema) {
        return requestApi.PUT(`/user/credentials`, {
            body: data,
        });
    }
}
