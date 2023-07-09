import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useContext, useState } from "react";
import { CreateCommentRequestSchema } from "../../../api/schemas/requests/comments";
import { API } from "../../../api/api";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { prepareComment } from "../utils/utils";
import { CommentResponseItemSchema } from "../../../api/schemas/responses/comments";
import { CommentContext, CommentsUtil } from "./CommentsBlock";

export interface NewCommentFormProps {
    ownerId: number;
}

export default function NewCommentForm(props: NewCommentFormProps) {
    const commentUtil: CommentsUtil = useContext<CommentsUtil>(CommentContext);

    const [commentText, setCommentText] = useState<string>("");
    const [postStatus, setPostStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    function onPostComment(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const pc: string = prepareComment(commentText);
        if (pc.length === 0) return;

        setPostStatus(FetchStatusEnum.FETCHING);

        const newComment: CreateCommentRequestSchema = { comment: pc, taskId: props.ownerId };
        API.comments
            .createComment(newComment)
            .then((comment: CommentResponseItemSchema) => {
                if (commentUtil.updateComment) {
                    commentUtil.updateComment(comment);
                }
                setPostStatus(FetchStatusEnum.SUCCESS);
                setCommentText("");
            })
            .catch(() => {
                setPostStatus(FetchStatusEnum.ERROR);
            })
            .finally();
    }

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <TextField
                    size="small"
                    id="outlined-multiline-static"
                    multiline
                    rows={3}
                    variant="outlined"
                    value={commentText}
                    onChange={(e) => {
                        setCommentText(e.target.value);
                    }}
                    fullWidth={true}
                />
                <LoadingButton
                    onClick={onPostComment}
                    disabled={prepareComment(commentText).length === 0}
                    loading={postStatus === FetchStatusEnum.FETCHING}
                >
                    Отправить
                </LoadingButton>
            </Box>
        </>
    );
}
