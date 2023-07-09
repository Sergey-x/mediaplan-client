import Box from "@mui/material/Box";
import { CommentResponseItemSchema } from "../../../api/schemas/responses/comments";
import MainAvatar from "../../../components/MainAvatar";
import React, { useContext, useState } from "react";
import Typography from "@mui/material/Typography";
import { UserSchema } from "../../../api/schemas/responses/users";
import { makeFullName } from "../../../utils/userUtils";
import { getDatetimeRepresentation } from "../../../utils/dateutils";
import authUserStore from "../../../store/AuthUserStore";
import { useTheme } from "@mui/material";
import EditCommentForm from "./EditCommentForm";
import { CommentContext, CommentsUtil } from "./CommentsBlock";
import WarningDialog from "../../../components/WarningDialog/WarningDialog";

interface CommentProps {
    comment: CommentResponseItemSchema;
}

export default function MyComment(props: CommentProps) {
    const theme = useTheme();
    const commentUtil: CommentsUtil = useContext<CommentsUtil>(CommentContext);

    // состояние видимости окна подтверждения удаления
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

    const [isCommentEdit, setIsCommentEdit] = useState<boolean>(false);

    function onClickDelete() {
        setOpenDeleteConfirm(true);
    }

    const currentUser: UserSchema | undefined = authUserStore.getMe;
    const author: UserSchema = props.comment.author;

    if (currentUser === undefined) return null;

    if (isCommentEdit) return <EditCommentForm comment={props.comment} undoEdit={() => setIsCommentEdit(false)} />;

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "stretch", mb: 2 }}>
                <Box sx={{ mr: 1 }}>
                    <MainAvatar size={35} user={author} />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex" }}>
                        <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>{makeFullName(author)}</Typography>
                    </Box>

                    <Box sx={{ my: 0 }}>
                        <Typography variant="caption" sx={{ fontSize: "0.9rem", lineHeight: "0.9rem" }}>
                            {props.comment.comment}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "0.8rem", color: theme.palette.grey.A700 }}>
                            {getDatetimeRepresentation(new Date(props.comment.createdAt))}
                        </Typography>

                        {author.id === currentUser.id && (
                            <Box>
                                <Typography
                                    component="span"
                                    onClick={onClickDelete}
                                    sx={{
                                        fontSize: "0.8rem",
                                        color: theme.palette.grey.A700,
                                        "&:hover": {
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                >
                                    Удалить
                                </Typography>
                                <Typography
                                    component="span"
                                    onClick={() => setIsCommentEdit(true)}
                                    sx={{
                                        ml: 1,
                                        fontSize: "0.8rem",
                                        color: theme.palette.grey.A700,
                                        "&:hover": {
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                >
                                    Изменить
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                <WarningDialog
                    open={openDeleteConfirm}
                    setOpen={setOpenDeleteConfirm}
                    title="Удалить комментарий?"
                    text={`Удалить этот комментарий для всех?`}
                    handleAgree={() => {
                        if (commentUtil.deleteComment) {
                            commentUtil.deleteComment(props.comment.id);
                        }
                    }}
                />
            </Box>
        </>
    );
}
