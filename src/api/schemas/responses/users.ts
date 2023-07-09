export interface GetAllUsersResponseSchema {
    users: UserSchema[];
}

export interface UserSchema {
    id: number;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    patronymic?: string;
    email?: string;
    creationDate?: Date;
    departmentId?: number;
    isAdmin?: boolean;
}
