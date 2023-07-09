import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { API } from "../../../api/api";
import { UpdateTaskRequestSchema } from "../../../api/schemas/requests/tasks";
import MultilineTextInput from "../../inputs/MultilineTextInput/MultilineTextInput";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";
import { getTimezoneDatetime } from "../../../utils/dateutils";
import DatetimeInput from "../../inputs/DatetimeInput/DatetimeInput";
import EventSelector from "../../selectors/EventSelector/EventSelector";
import UnitSelector from "../../selectors/UnitSelector/UnitSelector";
import UsersSelector from "../../selectors/UsersSelector";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import { UserSchema } from "../../../api/schemas/responses/users";
import { observer } from "mobx-react-lite";
import taskStore from "../../../store/TaskStore";
import FormHeader from "../../FormHeader/FormHeader";
import WarningDialogWithInputConfirmation from "../../WarningDialog/WarningDialogWithInputConfirmation";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";

function EditTaskForm() {
    const navigate = useNavigate();
    const urlParams = useParams();
    const id: number = +(urlParams.taskId || 0);

    const location = useLocation();
    const state = location.state;
    const navigateAfterPath: string | undefined = state ? state.navigateAfterPath : undefined;

    // данные задачи
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {}, [taskStore.getById(id)]);
    const task = taskStore.getById(id);

    // task data
    const [taskName, setTaskName] = useState<string>("");
    const [taskDescription, setTaskDescription] = useState<string>("");
    const [deadline, setDeadline] = useState<Date | null>(null);

    const [selectedEvent, setSelectedEvent] = useState<EventResponseItemSchema | undefined>(undefined);
    const [selectedUnit, setSelectedUnit] = useState<UnitResponseItemSchema | undefined>(undefined);
    const [selectedExecutors, setSelectedExecutors] = useState<UserSchema[]>([]);

    // состояние видимости окна подтверждения удаления
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

    // circular loaders
    const [isUpdateActionInProgress, setIsUpdateActionInProgress] = useState(false);
    const [deleteActionStatus, setDeleteActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    useEffect(() => {
        if (task !== undefined) {
            setTaskName(task.name);
            setTaskDescription(task.description);
            setDeadline(task.expirationTime ? new Date(task.expirationTime) : null);
            setSelectedUnit(task.department);
            setSelectedEvent(task.event);
            setSelectedExecutors(task.assignee);
        }
    }, [task]);

    function dropTask() {
        if (task === undefined) return;
        setDeleteActionStatus(FetchStatusEnum.FETCHING);

        API.tasks
            .delete(task.id)
            .then(() => {
                setDeleteActionStatus(FetchStatusEnum.SUCCESS);
                let backStep = 3;
                if (location.pathname.endsWith("/")) backStep += 1;

                navigate(location.pathname.split("/").slice(0, -backStep).join("/"));
                taskStore.delete(task.id);
            })
            .catch(() => {
                setDeleteActionStatus(FetchStatusEnum.ERROR);
            });
    }

    function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!id || !task) {
            return;
        }
        if (!deadline) return;
        setIsUpdateActionInProgress(true);

        const updateTaskRequestBody: UpdateTaskRequestSchema = {
            taskId: id,
            name: taskName,
            description: taskDescription,
            expirationTime: getTimezoneDatetime(deadline),
            eventId: selectedEvent?.id,
            departmentId: selectedUnit?.id,
            assigneeIds: selectedExecutors.map((u) => u.id),
        };

        API.tasks
            .updateTaskById(updateTaskRequestBody)
            .then((data: TaskResponseItemSchema) => {
                taskStore.update(data.id, { ...data, files: task.files });
                if (navigateAfterPath) {
                    navigate(navigateAfterPath);
                } else {
                    navigate(-1);
                }
            })
            .finally(() => {
                setIsUpdateActionInProgress(false);
            });
    }

    return (
        <Box sx={{ maxWidth: "500px" }}>
            <FormHeader text="Изменение задачи" />

            <TextField
                size="small"
                id="standard-basic"
                label="Название задачи"
                variant="outlined"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                fullWidth={true}
                className="mb-3"
            />

            <MultilineTextInput
                label="Подробное описание"
                value={taskDescription}
                handleChange={setTaskDescription}
                maxLength={5000}
            />

            {deadline && (
                <Box sx={{ mb: 3 }}>
                    <DatetimeInput datetime={deadline} setDatetime={setDeadline} required />
                </Box>
            )}

            <Box sx={{ mb: 2 }}>
                <EventSelector setInputValue={setSelectedEvent} inputValue={selectedEvent || null} />
            </Box>

            <Box sx={{ mb: 2 }}>
                <UnitSelector setInputValue={setSelectedUnit} inputValue={selectedUnit || null} />
            </Box>

            <UsersSelector
                setInputValue={setSelectedExecutors}
                inputValue={selectedExecutors}
                label="Выберите исполнителей"
            />

            <LoadingButton
                onClick={onSubmit}
                loading={isUpdateActionInProgress}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Сохранить изменения
            </LoadingButton>

            <LoadingButton
                onClick={() => setOpenDeleteConfirm(true)}
                type="submit"
                fullWidth
                color="error"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={deleteActionStatus === FetchStatusEnum.FETCHING}
            >
                Удалить задачу
            </LoadingButton>

            {task && (
                <WarningDialogWithInputConfirmation
                    controlValue={task.name}
                    handleAgree={dropTask}
                    open={openDeleteConfirm}
                    setOpen={setOpenDeleteConfirm}
                    title="Удаление задачи"
                    text={`Для удаления задачи введите`}
                />
            )}
        </Box>
    );
}

export default observer(EditTaskForm);
