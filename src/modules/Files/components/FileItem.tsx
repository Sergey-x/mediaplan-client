import React from "react";
import Typography from "@mui/material/Typography";
import { fileSize } from "../utils/utils";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import ExtensionFileIcon from "./ExtensionFileIcon";
import CircularProgress from "@mui/material/CircularProgress";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import DoneIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";
import Box from "@mui/material/Box";

function getLastItem(arr: Array<any>): any {
    return arr[arr.length - 1];
}

interface FileItemProps {
    file: File;
    loading?: FetchStatusStrings | undefined;
    detachFile: (fileName: string) => void;
}

const FileItem = (props: FileItemProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                my: 1,
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
            }}
        >
            <ExtensionFileIcon extension={getLastItem(props.file.name.split("."))} />
            <Typography
                variant="body1"
                component="span"
                sx={{
                    fontSize: "0.9rem",
                    ml: 1,
                    maxWidth: "calc(100% - 150px)",
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    msOverflowStyle: "none" /* IE and Edge */,
                    scrollbarWidth: "none" /* Firefox */,
                }}
            >
                {props.file.name}
            </Typography>

            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "0.9rem", ml: "auto", px: 1 }} component="span">
                    {fileSize(props.file.size)}
                </Typography>

                {Boolean(props.loading === FetchStatusEnum.IDLE || props.loading === undefined) && (
                    <IconButton onClick={() => props.detachFile(props.file.name)} sx={{ p: 0, m: 0 }}>
                        <ClearIcon />
                    </IconButton>
                )}

                {props.loading === FetchStatusEnum.FETCHING && <CircularProgress size={16} />}
                {props.loading === FetchStatusEnum.SUCCESS && <DoneIcon color="success" fontSize={"small"} />}
                {props.loading === FetchStatusEnum.ERROR && <ErrorIcon color="error" fontSize={"small"} />}
            </Box>
        </Box>
    );
};

export default FileItem;
