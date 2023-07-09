import { observer } from "mobx-react-lite";
import { UserSchema } from "../../../api/schemas/responses/users";
import authUserStore from "../../../store/AuthUserStore";
import * as React from "react";
import { useState } from "react";
import { API } from "../../../api/api";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import MainAvatar from "../../../components/MainAvatar";
import LoadingButton from "@mui/lab/LoadingButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import WarningDialog from "../../../components/WarningDialog/WarningDialog";

const availableImageFormats = ["bmp", "jpg", "jpeg", "gif", "png", "tiff", "svg"];

const UserAvatarManager = observer(() => {
    // текущий пользователь
    const user: UserSchema | undefined = authUserStore.getMe;

    // статус запроса на обновление аватара
    const [isEditAvatarInProgress, setIsEditAvatarInProgress] = useState<boolean>(false);
    const [isEditAvatarError, setIsEditAvatarError] = useState<boolean>(false);

    // состояние видимости окна подтверждения удаления
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

    const uploadAvatarHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user?.id || !event.target.files) {
            return;
        }

        const newAvatar = event.target.files[0];
        const filename: string = newAvatar.name.toLowerCase();

        const isFileExtensionAvailable: boolean = availableImageFormats.some((ext) => filename.endsWith(ext));
        if (!isFileExtensionAvailable) {
            alert("Недопустимое расширение файла! Вставьте картинку");
            return;
        }

        setIsEditAvatarInProgress(true);

        API.avatars
            .set(+user.id, newAvatar)
            .then(() => {
                authUserStore.prefetchMe();
            })
            .catch(() => {
                setIsEditAvatarError(true);
            })
            .finally(() => {
                setIsEditAvatarInProgress(false);
            });
    };

    function onClickDelete() {
        setOpenDeleteConfirm(true);
    }

    const deleteAvatarHandler = () => {
        if (!user?.id) {
            return;
        }

        API.avatars
            .delete(+user.id)
            .then(() => {
                authUserStore.prefetchMe();
            })
            .catch(() => {})
            .finally(() => {});
    };

    const handleCloseErrorEditAvatarSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsEditAvatarError(false);
    };

    return (
        <>
            <Typography variant="h6" component="h2" sx={{ mt: 3 }}>
                Аватар
            </Typography>
            <Divider />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: { xs: "center", sm: "stretch" },
                    alignItems: { xs: "center", sm: "stretch" },
                    my: 2,
                    mx: 0,
                    px: 0,
                }}
            >
                <Box sx={{ mr: 3, mb: 1 }}>
                    <MainAvatar user={user} size={100} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", flexGrow: 1, alignItems: "flex-start" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <LoadingButton
                            fullWidth
                            variant="contained"
                            component="label"
                            startIcon={<AddCircleIcon />}
                            loading={isEditAvatarInProgress}
                        >
                            Загрузить изображение
                            <input hidden type="file" onInput={uploadAvatarHandler} />
                        </LoadingButton>

                        <Typography sx={{ fontSize: "0.9rem", color: "grey" }}>
                            Допустимые типы файлов: {availableImageFormats.join(", ")}
                        </Typography>
                    </Box>

                    <Tooltip title="Удалить аватар">
                        <IconButton
                            color="error"
                            sx={{ borderWidth: 1, borderRadius: 5, borderColor: "red" }}
                            onClick={onClickDelete}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <ErrorSnackbar handleClose={handleCloseErrorEditAvatarSnackbar} isOpen={isEditAvatarError}>
                Произошла ошибка, попробуйте позже
            </ErrorSnackbar>

            <WarningDialog
                open={openDeleteConfirm}
                setOpen={setOpenDeleteConfirm}
                title="Удалить аватар?"
                text={`Вы уверены, что хотите удалить свой аватар?`}
                handleAgree={deleteAvatarHandler}
            />
        </>
    );
});

export default UserAvatarManager;
