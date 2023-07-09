import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import { observer } from "mobx-react-lite";
import Typography from "@mui/material/Typography";
import { compareTasks } from "../../../utils/taskUtils";
import BaseTask from "../../../components/tasks/BaseTask";
import { ViewModeEnum } from "../../../enums/viewModEnum";
import React from "react";

interface TodayTaskListProps {
    todayDateStr: string;
    dayTasks: TaskResponseItemSchema[];
}

const TodayTaskList = observer((props: TodayTaskListProps) => {
    return (
        <>
            {props.dayTasks.length === 0 && (
                <Typography variant="subtitle1" component="p" className="text-center">
                    {props.todayDateStr}&nbsp;задач нет
                </Typography>
            )}

            {props.dayTasks.length > 0 && (
                <Typography variant="subtitle1" component="p" className="text-center">
                    Задачи {props.todayDateStr}
                </Typography>
            )}

            {props.dayTasks.sort(compareTasks).map((task) => (
                <div className="mb-2" key={task.id}>
                    <BaseTask task={task} viewMode={ViewModeEnum.PREVIEW} />
                </div>
            ))}
        </>
    );
});

export default TodayTaskList;
