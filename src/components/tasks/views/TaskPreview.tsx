import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import UnitLink from "../../links/UnitLink/UnitLink";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import EventLink from "../../links/EventLink/EventLink";
import { makeRelativeTaskLinkById, RelativeEditPath } from "../../../routes/paths";
import TaskName from "../common/TaskName";
import React from "react";
import { TaskDescription } from "../common/common";
import DeadlineAndStatus from "../../common/tasks_events/DeadlineAndStatus";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { ProgressStatusEnum } from "../../../enums/progressEnum";
import { TaskActionsProps, TaskViewProps } from "./interfaces";
import Executors from "../common/Executors";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export interface TaskPreviewProps extends TaskViewProps, TaskActionsProps {}

export default function TaskPreview(props: TaskPreviewProps) {
    const navigate = useNavigate();
    const task: TaskResponseItemSchema = props.task;
    const theme = useTheme();

    return (
        <Box
            sx={{ display: "flex", flexDirection: "column", "&:hover": { cursor: "pointer", background: "#f4f9ff" } }}
            onClick={props.navigateToFull}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <DeadlineAndStatus
                    endDate={task.expirationTime}
                    status={task.taskStatus}
                    onChangeStatus={props.toggleTaskStatus(task.taskStatus === ProgressStatusEnum.COMPLETED)}
                />

                <Tooltip title="Редактировать">
                    <IconButton
                        sx={{ p: 0 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`${makeRelativeTaskLinkById(task.id)}/${RelativeEditPath}`);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Link
                component="a"
                href={makeRelativeTaskLinkById(task.id)}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    props.navigateToFull(undefined);
                }}
                sx={{
                    "&:hover": {
                        cursor: "pointer",
                    },
                }}
            >
                <TaskName name={task.name} />
            </Link>
            <TaskDescription>{task.description}</TaskDescription>

            {task.event && <EventLink event={task?.event} />}
            {task.department && <UnitLink unit={task.department} />}

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {!props.task.files && (
                    <>
                        <Tooltip
                            title={
                                <Typography variant="body1" sx={{ fontSize: "15px" }}>
                                    Файловый сервис временно не доступен
                                </Typography>
                            }
                        >
                            <BrokenImageIcon sx={{ color: theme.palette.error.main }}></BrokenImageIcon>
                        </Tooltip>
                    </>
                )}
                {props.task.files && Boolean(props.task.files.length) && (
                    <Typography component="p" variant="subtitle1" sx={{ color: "grey" }}>
                        Файлов: {props.task.files.length}
                    </Typography>
                )}

                <Box sx={{ marginLeft: "auto" }}>
                    <Executors users={task.assignee} />
                </Box>
            </Box>
        </Box>
    );
}
