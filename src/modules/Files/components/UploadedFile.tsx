import { FileResponseItemSchema } from "../../../api/schemas/responses/files";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import React, { useState } from "react";
import { fileSize, makeFileLink } from "../utils/utils";
import { EventTypesStrings } from "../../../enums/filesEnums";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { API } from "../../../api/api";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import SuccessSnackbar from "../../../components/snackbars/SuccessSnackbar";
import Divider from "@mui/material/Divider";
import WarningDialog from "../../../components/WarningDialog/WarningDialog";
import Link from "@mui/material/Link";
import ExtensionFileIcon from "./ExtensionFileIcon";
import { getDatetimeRepresentation } from "../../../utils/dateutils";
import MoreActionMenu, { ActionItem } from "../../../components/common/MoreActionMenu";

const getAdditionalFileMenuActions = (deleteHandler: () => void) => {
    const additionalFileMenuActions: ActionItem[] = [
        {
            title: "Удалить",
            icon: (
                <IconButton color="error">
                    <DeleteForeverIcon />
                </IconButton>
            ),
            clickHandler: deleteHandler,
        },
    ];
    return additionalFileMenuActions;
};

interface UploadedFilePreviewProps {
    file: FileResponseItemSchema;
    eventType: EventTypesStrings;
    isEditModeOn?: boolean;
}

export default function UploadedFile(props: UploadedFilePreviewProps) {
    // состояние видимости окна подтверждения удаления
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

    // результаты api запросов
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [isDeletingSuccess, setIsDeletingSuccess] = useState<boolean>(false);
    const [isDeletingError, setIsDeletingError] = useState<boolean>(false);

    function onClickDelete() {
        setOpenDeleteConfirm(true);
    }

    function dropFile() {
        API.files
            .dropFileById(props.file.id)
            .then(() => {
                setIsDeleted(true);
                setIsDeletingSuccess(true);
            })
            .catch(() => {
                setIsDeletingError(true);
            })
            .finally();
    }

    const handleCloseSuccessDeleteSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsDeletingSuccess(false);
    };

    const handleCloseErrorDeleteSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsDeletingError(false);
    };

    return (
        <>
            {!isDeleted && (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: "300px",
                            width: "100%",
                            overflowX: "auto",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                            msOverflowStyle: "none" /* IE and Edge */,
                            scrollbarWidth: "none" /* Firefox */,
                        }}
                    >
                        <ExtensionFileIcon extension={props.file.filename.split(".").pop() || ""} />
                        <Tooltip
                            title={
                                <Typography>
                                    Скачать файл "{props.file.filename}"
                                    <br />
                                    Добавлен: {getDatetimeRepresentation(new Date(props.file.dt_created))}
                                </Typography>
                            }
                        >
                            <Link
                                href={makeFileLink(props.file, props.file.owner_id, props.eventType)}
                                target="_blank"
                                sx={{ my: 0, py: 0, mb: "-6px", maxWidth: "calc(100% - 150px)" }}
                            >
                                <Typography
                                    variant="body1"
                                    component="span"
                                    sx={{
                                        display: "inline-block",
                                        fontSize: "0.9rem",
                                        maxWidth: "100%",
                                        ml: 1,
                                        overflow: "auto",
                                        "&::-webkit-scrollbar": {
                                            display: "none",
                                        },
                                        msOverflowStyle: "none" /* IE and Edge */,
                                        scrollbarWidth: "none" /* Firefox */,
                                    }}
                                >
                                    {props.file.filename}
                                </Typography>
                            </Link>
                        </Tooltip>

                        <Box sx={{ ml: "auto" }}>
                            <Typography
                                sx={{
                                    mx: 1,
                                    fontSize: "0.87rem",
                                    color: "#7a7a7a",
                                }}
                                component="span"
                            >
                                {fileSize(props.file.size)}
                            </Typography>

                            <MoreActionMenu actions={getAdditionalFileMenuActions(onClickDelete)} />
                        </Box>
                    </Box>
                    <Divider />
                </>
            )}
            <WarningDialog
                open={openDeleteConfirm}
                setOpen={setOpenDeleteConfirm}
                title="Удалить файл?"
                text={`Вы уверены, что хотите удалить "${props.file.filename}"?`}
                handleAgree={dropFile}
            />

            <ErrorSnackbar handleClose={handleCloseErrorDeleteSnackbar} isOpen={isDeletingError}>
                Не удалось удалить файл {props.file.filename}!
            </ErrorSnackbar>
            <SuccessSnackbar handleClose={handleCloseSuccessDeleteSnackbar} isOpen={isDeletingSuccess}>
                Файл {props.file.filename} удален!
            </SuccessSnackbar>
        </>
    );
}
