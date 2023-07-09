import React from "react";
import { useLocation, useParams } from "react-router-dom";
import taskStore from "../../../store/TaskStore";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import { observer } from "mobx-react-lite";
import ModalView from "./ModalView";
import CircularProgress from "@mui/material/CircularProgress";
import { RelativeCreatePath } from "../../../routes/paths";

function TaskModalView() {
    const location = useLocation();
    const urlParams = useParams();

    const taskId = +(urlParams.taskId || 0);
    const task: TaskResponseItemSchema | undefined = taskStore.getById(taskId);

    if (task === undefined) {
        return (
            <ModalView isOpen={true}>
                <CircularProgress color="primary" />
            </ModalView>
        );
    }

    return (
        <>
            <ModalView isOpen={taskId > 0 || location.pathname.endsWith(RelativeCreatePath)} />
        </>
    );
}

export default observer(TaskModalView);
