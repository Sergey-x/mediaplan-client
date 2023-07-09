import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

import { ProcessViewProps } from "./interfaces";
import { getDatetimeRepresentation } from "../../../utils/dateutils";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { ProgressStatusEnum } from "../../../enums/progressEnum";
import { makeRelativeTaskLinkById, RelativeEditPath } from "../../../routes/paths";
import { createTaskStore } from "../../CreateTaskForm";
import { Outlet, useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import theme from "../../../assets/theme";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import Box from "@mui/material/Box";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { observer } from "mobx-react-lite";
import { UploadedFileList, Uploader } from "../../Files";
import { FileOwnerTypesEnum } from "../../../enums/filesEnums";
import processStore from "../store/ProcessStore";

interface ProcessFullViewProps extends ProcessViewProps {}

function ProcessFullView(props: ProcessFullViewProps) {
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h6" component="h2" sx={{ textAlign: "center" }}>
                    {props.process.name}
                </Typography>
                <Tooltip title="Редактировать">
                    <IconButton
                        sx={{ ml: 2, p: 0, "&:hover": { color: theme.palette.primary.main } }}
                        onClick={() => navigate(RelativeEditPath)}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Добавить задачу">
                    <IconButton
                        sx={{ ml: 2, p: 0, "&:hover": { color: theme.palette.primary.main } }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            createTaskStore.setProcess(props.process);
                            createTaskStore.setIsOpen(true);
                        }}
                    >
                        <NoteAddIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
                {props.process.description}
            </Typography>
            <Box sx={{ maxWidth: "500px", mx: "auto" }}>
                <Uploader
                    destType={FileOwnerTypesEnum.PROCESS}
                    destId={props.process.id}
                    successHandler={() => {
                        processStore.fetchProcessById(props.process.id);
                    }}
                />
                <UploadedFileList files={props.process.files} eventType={FileOwnerTypesEnum.PROCESS} />
            </Box>

            <Timeline position="right" sx={{ px: 0, mb: 0 }}>
                {props.tasks &&
                    props.tasks.map((task) => (
                        <TimelineItem key={task.id}>
                            <TimelineOppositeContent color="text.secondary" sx={{ pl: 0 }}>
                                <Link
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigate(makeRelativeTaskLinkById(task.id));
                                    }}
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    {task.name}
                                </Link>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <Tooltip
                                    title={
                                        task.taskStatus === ProgressStatusEnum.COMPLETED
                                            ? "Задача выполнена"
                                            : new Date() > new Date(task.expirationTime)
                                            ? "Задача просрочена!"
                                            : "Задача выполняется"
                                    }
                                >
                                    <TimelineDot
                                        sx={{ width: "20px", height: "20px", borderWidth: "5px" }}
                                        variant={
                                            task.taskStatus === ProgressStatusEnum.IN_PROGRESS ? "outlined" : "filled"
                                        }
                                        color={
                                            task.taskStatus === ProgressStatusEnum.COMPLETED
                                                ? "success"
                                                : new Date() > new Date(task.expirationTime)
                                                ? "error"
                                                : "primary"
                                        }
                                    />
                                </Tooltip>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ pr: 0 }}>
                                {getDatetimeRepresentation(new Date(task.expirationTime))}
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                {props.process.status === ProgressStatusEnum.COMPLETED && (
                    <TimelineItem>
                        <TimelineOppositeContent color="text.secondary" sx={{ pl: 0 }}></TimelineOppositeContent>
                        <TimelineSeparator>
                            <Tooltip title="Конец процесса">
                                <TimelineDot
                                    sx={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: theme.palette.grey.A700,
                                        color: theme.palette.grey.A700,
                                    }}
                                    variant="filled"
                                />
                            </Tooltip>
                        </TimelineSeparator>
                        <TimelineContent sx={{ pr: 0 }}></TimelineContent>
                    </TimelineItem>
                )}
            </Timeline>

            <Outlet />
        </>
    );
}

export default observer(ProcessFullView);
