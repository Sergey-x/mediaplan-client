import React from "react";
import { FileResponseItemSchema } from "../../../api/schemas/responses/files";
import UploadedFile from "./UploadedFile";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { EventTypesStrings } from "../../../enums/filesEnums";
import { compareFile } from "../utils/utils";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface FileListProps {
    files?: FileResponseItemSchema[] | null | undefined;
    eventType: EventTypesStrings;
    isEditModeOn?: boolean;
    sectionHeader?: string;
}

export default function UploadedFileList(props: FileListProps) {
    if (!props.files)
        return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", my: 1 }}>
                <BrokenImageIcon></BrokenImageIcon>
                <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", p: 0 }}>
                    Файловый сервис временно недоступен
                </Typography>
            </Box>
        );
    return (
        <>
            {props.files.length > 0 && (
                <>
                    {props.files.sort(compareFile).map((f: FileResponseItemSchema) => (
                        <UploadedFile
                            key={f.id}
                            file={f}
                            eventType={props.eventType}
                            isEditModeOn={Boolean(props.isEditModeOn)}
                        />
                    ))}
                </>
            )}
        </>
    );
}
