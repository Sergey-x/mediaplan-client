import { CreateCommentRequestSchema } from "../schemas/requests/comments";
import requestApi from "../fetchApi";
import { CommentResponseItemSchema, GetCommentsResponseSchema } from "../schemas/responses/comments";

export class CommentsApi {
    static apiPrefix = "/schedule/comment";

    static createComment(data: CreateCommentRequestSchema): Promise<CommentResponseItemSchema> {
        return requestApi.POST(`${this.apiPrefix}`, { body: data });
    }

    static updateComment(commentId: number, commentText: string): Promise<CommentResponseItemSchema> {
        return requestApi.PATCH(`${this.apiPrefix}/${commentId}?comment=${commentText}`);
    }

    static deleteComment(commentId: number): Promise<void> {
        return requestApi.DELETE(`${this.apiPrefix}/${commentId}`);
    }

    static async getCommentsByTaskId(id: number): Promise<CommentResponseItemSchema[]> {
        return requestApi.GET(`${this.apiPrefix}/task/${id}`).then((res: GetCommentsResponseSchema) => {
            return res.comments;
        });
    }
}
