import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useContext, useState } from "react";
import { API } from "../../../api/api";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { CommentResponseItemSchema } from "../../../api/schemas/responses/comments";
import { prepareComment } from "../utils/utils";
import Button from "@mui/material/Button";
import { CommentContext, CommentsUtil } from "./CommentsBlock";

export interface EditCommentFormProps {
    comment: CommentResponseItemSchema;
    undoEdit: () => void;
}

export default function EditCommentForm(props: EditCommentFormProps) {
    const commentUtil: CommentsUtil = useContext<CommentsUtil>(CommentContext);

    const [commentText, setCommentText] = useState<string>(props.comment.comment);
    const [postStatus, setPostStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    function onEditComment(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const pc: string = prepareComment(commentText);
        if (pc.length === 0) return;

        setPostStatus(FetchStatusEnum.FETCHING);

        API.comments
            .updateComment(props.comment.id, pc)
            .then((comment: CommentResponseItemSchema) => {
                if (commentUtil.updateComment) {
                    commentUtil.updateComment(comment);
                }
                props.undoEdit();
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
                    onClick={onEditComment}
                    disabled={prepareComment(commentText).length === 0}
                    loading={postStatus === FetchStatusEnum.FETCHING}
                >
                    Сохранить
                </LoadingButton>

                <Button onClick={props.undoEdit} color="error">
                    Отмена
                </Button>
            </Box>
        </>
    );
}
