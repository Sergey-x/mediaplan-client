export interface UpdateUserInfoRequestSchema {
    userId: number;
    firstName?: string;
    lastName?: string;
    patronymic?: string;
    avatar?: string;
    isAdmin?: boolean;
}
