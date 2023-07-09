import { API } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { TaskResponseItemSchema } from "../../api/schemas/responses/tasks";
import React from "react";
import { ProgressStatusEnum, ProgressStatusStrings } from "../../enums/progressEnum";
import { ViewModeStrings } from "../../enums/viewModEnum";
import { UpdateTaskRequestSchema } from "../../api/schemas/requests/tasks";
import { makeRelativeTaskLinkById, RelativeEditPath } from "../../routes/paths";
import BaseTaskView from "./views/BaseTaskView";
import taskStore from "../../store/TaskStore";
import { observer } from "mobx-react-lite";

interface BaseTaskProps {
    task?: TaskResponseItemSchema;
    viewMode?: ViewModeStrings | undefined;
}

function BaseTask(props: BaseTaskProps) {
    const navigate = useNavigate();
    const urlParams = useParams();

    // id задачи
    const id: number = +(props.task?.id || urlParams.taskId || 0);

    if (!id) return null;

    // Получить данные задачи, если данные не переданы в пропсе
    const task = props.task || taskStore.getById(id);

    const navigateToEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!task?.id) return;
        navigate(`${RelativeEditPath}`, { relative: "path" });
    };

    const navigateToFull = (e: React.MouseEvent | undefined) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (!task?.id) return;
        navigate(makeRelativeTaskLinkById(id));
    };

    const toggleTaskStatus = (open: boolean) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!task?.id) return;

        const newStatus: ProgressStatusStrings = open ? ProgressStatusEnum.IN_PROGRESS : ProgressStatusEnum.COMPLETED;
        const updateStatusData: UpdateTaskRequestSchema = {
            taskId: task.id,
            status: newStatus,
        };

        API.tasks
            .updateTaskById(updateStatusData)
            .then(() => {
                if (task) {
                    taskStore.update(task.id, { ...task, taskStatus: newStatus });
                }
            })
            .catch(() => {})
            .finally(() => {});
    };

    if (!id || !task) return null;

    return (
        <>
            <BaseTaskView
                task={task}
                navigateToEdit={navigateToEdit}
                navigateToFull={navigateToFull}
                toggleTaskStatus={toggleTaskStatus}
                viewMode={props.viewMode}
            />
        </>
    );
}

export default observer(BaseTask);
