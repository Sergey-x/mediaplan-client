import BaseProcessView from "./BaseProcessView";
import { ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";
import { ProcessViewProps } from "./interfaces";
import processStore from "../store/ProcessStore";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import useApiCall from "../../../hooks/useApiCall";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import { API } from "../../../api/api";
import { ViewModeEnum } from "../../../enums/viewModEnum";
import { useEffect } from "react";
import taskStore from "../../../store/TaskStore";

interface BaseProcessProps extends Omit<ProcessViewProps, "process"> {
    process?: ProcessResponseItemSchema | undefined;
}

function BaseProcess(props: BaseProcessProps) {
    const urlParams = useParams();
    const processId: number = +(urlParams.processId || props.process?.id || 0);

    const process: ProcessResponseItemSchema | undefined = props.process || processStore.getById(processId);

    const getProcessTasksApiCall = useApiCall<TaskResponseItemSchema[]>(
        () =>
            API.tasks.getTasks({
                processes: [processId],
            }),
        [],
        [processId],
        Boolean(props.viewMode === ViewModeEnum.FULL)
    );

    useEffect(() => {
        taskStore.updateMany(getProcessTasksApiCall.data);
    }, [getProcessTasksApiCall.data]);

    if (process === undefined) return null;

    return (
        <>
            <BaseProcessView tasks={taskStore.getProcessTasks(process.id)} {...props} process={process} />
        </>
    );
}

export default observer(BaseProcess);
