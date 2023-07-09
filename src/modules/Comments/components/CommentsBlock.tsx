import Box from "@mui/material/Box";
import CommentList from "./CommentList";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import NewCommentForm, { NewCommentFormProps } from "./NewCommentForm";
import { observer } from "mobx-react-lite";
import CircularProgress from "@mui/material/CircularProgress";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { CommentResponseItemSchema } from "../../../api/schemas/responses/comments";
import { API } from "../../../api/api";
import { compareComment } from "../utils/utils";
import { useTheme } from "@mui/material";

export interface CommentsUtil {
    updateComment?: (commentData: CommentResponseItemSchema) => void;
    deleteComment?: (commentId: number) => void;
}

export const CommentContext = React.createContext<CommentsUtil>({});

export interface CommentBlockProps extends NewCommentFormProps {}

function CommentsBlock(props: CommentBlockProps) {
    const theme = useTheme();

    const [comments, setComments] = useState<CommentResponseItemSchema[]>([]);
    const [fetchStatus, setFetchStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    function updateComment(commentData: CommentResponseItemSchema) {
        const updatedComments = [...comments.filter((comment) => comment.id !== commentData.id), commentData];
        updatedComments.sort(compareComment);
        setComments(() => updatedComments);
    }

    function deleteComment(commentId: number) {
        API.comments.deleteComment(commentId).then(() => {
            const updatedComments = [...comments.filter((comment) => comment.id !== commentId)];
            setComments(() => updatedComments);
        });
    }

    useEffect(() => {
        setFetchStatus(FetchStatusEnum.FETCHING);

        API.comments
            .getCommentsByTaskId(props.ownerId)
            .then((data: CommentResponseItemSchema[]) => {
                setFetchStatus(FetchStatusEnum.SUCCESS);
                setComments(data);
            })
            .catch(() => {
                setFetchStatus(FetchStatusEnum.ERROR);
            });
    }, [props.ownerId]);

    return (
        <>
            <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "1.1rem" }}>Комментарии &nbsp;</Typography>
                    {fetchStatus === FetchStatusEnum.SUCCESS && (
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                ml: "4px",
                                verticalAlign: "middle",
                                color: theme.palette.primary.main,
                            }}
                        >
                            {comments.length}
                        </Typography>
                    )}

                    {fetchStatus === FetchStatusEnum.FETCHING && (
                        <CircularProgress color="primary" size={20} sx={{ ml: "4px" }} />
                    )}
                </Box>

                <CommentContext.Provider value={{ updateComment: updateComment, deleteComment: deleteComment }}>
                    <NewCommentForm ownerId={props.ownerId} />
                    <CommentList comments={comments} />
                </CommentContext.Provider>
            </Box>
        </>
    );
}

export default observer(CommentsBlock);
