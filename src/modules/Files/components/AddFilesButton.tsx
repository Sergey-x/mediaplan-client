import React from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Fab, Tooltip } from "@mui/material";

interface FileUploadProps {
    uploadHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AddFilesButton(props: FileUploadProps) {
    return (
        <Tooltip title="Прикрепить файлы">
            <label htmlFor="uploadPhoto">
                <input hidden multiple type="file" onInput={props.uploadHandler} id="uploadPhoto" />
                <Fab color="primary" size="small" component="span">
                    <AttachFileIcon />
                </Fab>
            </label>
        </Tooltip>
    );
}
