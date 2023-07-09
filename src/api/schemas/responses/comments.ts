import { UserSchema } from "./users";

export interface GetCommentsResponseSchema {
    comments: CommentResponseItemSchema[];
}

export interface CommentResponseItemSchema {
    id: number;
    comment: string;
    createdAt: string;
    author: UserSchema;
}
