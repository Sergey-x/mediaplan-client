import { CommentResponseItemSchema } from "../../../api/schemas/responses/comments";
import { compareDatetime } from "../../../utils/dateutils";

export function prepareComment(comment: string): string {
    return comment.trim();
}

export function compareComment(a: CommentResponseItemSchema, b: CommentResponseItemSchema): number {
    const byDatetime: number = compareDatetime(new Date(a.createdAt), new Date(b.createdAt));
    if (byDatetime) return byDatetime;
    return a.id - b.id;
}
