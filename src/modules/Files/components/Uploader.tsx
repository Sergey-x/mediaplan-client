import React, { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { API } from "../../../api/api";
import { EventTypesStrings } from "../../../enums/filesEnums";
import SuccessSnackbar from "../../../components/snackbars/SuccessSnackbar";
import AddFilesButton from "./AddFilesButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileItem from "./FileItem";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";

interface UploaderProps {
    destId: number | undefined;
    destType: EventTypesStrings;
    successHandler?: () => void;
    saveFromCreate?: boolean | undefined;
}

export default function Uploader(props: UploaderProps) {
    const [attachments, setAttachments] = useState<File[]>([]);
    const [loadingStatuses, setLoadingStatuses] = useState<FetchStatusStrings[]>([]);

    // статус загрузки
    const [inProgressFiles, setInProgressFiles] = useState<boolean>(false);
    const [isNewFilesFinished, setIsNewFilesFinished] = useState<boolean>(false);

    useEffect(() => {
        if (props.destId && props.saveFromCreate) {
            onLoadFiles(undefined);
        }
    }, [props.destId]);

    function onLoadFiles(event: React.MouseEvent<HTMLButtonElement> | undefined) {
        event?.preventDefault();

        if (props.destId === undefined) return;
        setInProgressFiles(true);
        setLoadingStatuses(Array(attachments.length).fill(FetchStatusEnum.FETCHING));

        const saveFilePromises = attachments.map((attachment, index) =>
            API.files
                .addFile(props.destId || 0, props.destType, attachment)
                .then(() => {
                    setLoadingStatuses((prev) => {
                        prev[index] = FetchStatusEnum.SUCCESS;
                        return [...prev];
                    });
                })
                .catch(() => {
                    setLoadingStatuses((prev) => {
                        prev[index] = FetchStatusEnum.ERROR;
                        return [...prev];
                    });
                })
                .finally(() => {})
        );

        Promise.all(saveFilePromises)
            .then(() => {
                setIsNewFilesFinished(true);
                setAttachments([]);
                if (props.successHandler) props.successHandler();
            })
            .catch(() => {})
            .finally(() => {
                setInProgressFiles(false);
            });
    }

    const handleCloseNewFilesSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsNewFilesFinished(false);
    };

    const uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files;
        if (!newFiles) return;
        setAttachments([...attachments, ...Array.from(newFiles)]);
    };

    return (
        <>
            <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" component="span" sx={{ fontWeight: "bold" }}>
                    Файлы
                </Typography>
                <AddFilesButton uploadHandler={uploadHandler} />
            </Box>

            <Box sx={{ mt: 1 }}>
                {attachments.map((f: File, index) => (
                    <FileItem
                        key={f.name}
                        file={f}
                        loading={loadingStatuses[index]}
                        detachFile={(excludeFilename: string) =>
                            setAttachments([...attachments.filter((attachment) => attachment.name !== excludeFilename)])
                        }
                    />
                ))}
            </Box>

            {Boolean(!props.saveFromCreate && attachments.length > 0) && (
                <LoadingButton
                    fullWidth
                    color="success"
                    onClick={onLoadFiles}
                    loading={inProgressFiles}
                    variant="contained"
                    sx={{ my: 2 }}
                >
                    Прикрепить файлы
                </LoadingButton>
            )}

            <SuccessSnackbar handleClose={handleCloseNewFilesSnackbar} isOpen={isNewFilesFinished}>
                Файлы загружены!
            </SuccessSnackbar>
        </>
    );
}
