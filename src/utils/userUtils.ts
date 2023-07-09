import { UserSchema } from "../api/schemas/responses/users";

export function makeFullName(user: UserSchema | undefined | null): string {
    if (!user) return "Noname";

    return [user.lastName, user.firstName, user.patronymic].filter(Boolean).join(" ").trim();
}
