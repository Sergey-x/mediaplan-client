import { observer } from "mobx-react-lite";
import { ViewModeEnum, ViewModeStrings } from "../../../enums/viewModEnum";
import BaseUnitView from "./BaseUnitView";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeUnitLinkById, RelativeEditPath } from "../../../routes/paths";
import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";
import unitStore from "../../../store/UnitStore";
import useApiCall from "../../../hooks/useApiCall";
import { API } from "../../../api/api";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import taskStore from "../../../store/TaskStore";

interface BaseUnitProps {
    unit?: UnitResponseItemSchema;
    viewMode?: ViewModeStrings;
    selected?: boolean;
}

const BaseUnit = observer((props: BaseUnitProps) => {
    const navigate = useNavigate();
    const urlParams = useParams();

    // id отдела
    const id: number = +(urlParams?.id || props.unit?.id || 0);

    // Получить данные отдела, если данные не переданы в пропсе
    const unit = props.unit || unitStore.getById(id);

    const getTasksApiCall = useApiCall<TaskResponseItemSchema[]>(
        () =>
            API.tasks.getTasks({
                departments: [id],
            }),
        [],
        [id],
        Boolean(props.viewMode === ViewModeEnum.FULL)
    );
    useEffect(() => {
        taskStore.updateMany(getTasksApiCall.data);
    }, [getTasksApiCall.data]);

    const unitTasks: TaskResponseItemSchema[] = taskStore.getUnitTasks(id);

    function navigateToEdit(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        navigate(RelativeEditPath);
    }

    function navigateToFull(e: React.MouseEvent | undefined) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (!unit) return;
        navigate(makeUnitLinkById(unit.id));
    }

    if (!id || !unit) return null;

    return (
        <BaseUnitView
            viewMode={props.viewMode}
            navigateToEdit={navigateToEdit}
            navigateToFull={navigateToFull}
            unit={unit}
            selected={Boolean(props.selected)}
            tasks={unitTasks}
        />
    );
});

export default BaseUnit;
