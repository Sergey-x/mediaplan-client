import React from "react";
import TaskName from "../common/TaskName";
import Executors from "../common/Executors";
import UnitLink from "../../links/UnitLink/UnitLink";
import EditIcon from "@mui/icons-material/Edit";
import { ProgressStatusEnum } from "../../../enums/progressEnum";
import EventLink from "../../links/EventLink/EventLink";
import { TaskDescription } from "../common/common";
import { FileOwnerTypesEnum } from "../../../enums/filesEnums";
import DeadlineAndStatus from "../../common/tasks_events/DeadlineAndStatus";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import { UploadedFileList, Uploader } from "../../../modules/Files";
import { Box, IconButton, Tooltip } from "@mui/material";
import { TaskActionsProps, TaskViewProps } from "./interfaces";
import CommentsBlock from "../../../modules/Comments";
import taskStore from "../../../store/TaskStore";

export interface FullTaskViewProps extends TaskViewProps, TaskActionsProps {}

export default function FullTaskView(props: FullTaskViewProps) {
    const task: TaskResponseItemSchema = props.task;

    return (
        <Box sx={{ maxWidth: "500px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <DeadlineAndStatus
                    endDate={task.expirationTime}
                    status={task.taskStatus}
                    onChangeStatus={props.toggleTaskStatus(task.taskStatus === ProgressStatusEnum.COMPLETED)}
                />
                <Tooltip title="Редактировать">
                    <IconButton sx={{ p: 0 }} onClick={props.navigateToEdit}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <TaskName name={task?.name} />
            <TaskDescription>{task?.description}</TaskDescription>

            {task?.department && <UnitLink unit={task.department} />}
            {task?.event && <EventLink event={task?.event} />}

            <Executors users={task.assignee} fullView />
            <Uploader
                destType={FileOwnerTypesEnum.TASK}
                destId={task.id}
                successHandler={() => {
                    taskStore.fetchById(task.id);
                }}
            />
            <UploadedFileList files={props.task.files} eventType={FileOwnerTypesEnum.TASK} />

            <CommentsBlock ownerId={props.task.id} />
        </Box>
    );
}
