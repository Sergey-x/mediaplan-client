import Box from "@mui/material/Box";
import { CommentResponseItemSchema } from "../../../api/schemas/responses/comments";
import MyComment from "./MyComment";

export interface CommentListProps {
    comments: CommentResponseItemSchema[];
}

export default function CommentList(props: CommentListProps) {
    return (
        <Box>
            {props.comments.map((comment: CommentResponseItemSchema) => (
                <MyComment key={comment.id} comment={comment} />
            ))}
        </Box>
    );
}
