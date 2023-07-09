import FormHeader from "../../FormHeader/FormHeader";
import React, { useEffect, useState } from "react";
import { API } from "../../../api/api";
import { EditEventRequestSchema } from "../../../api/schemas/requests/events";
import FormInputItemWrapper from "../../FormInputItemWrapper";
import TextField from "@mui/material/TextField";
import MultilineTextInput from "../../inputs/MultilineTextInput/MultilineTextInput";
import LoadingButton from "@mui/lab/LoadingButton";
import SuccessSnackbar from "../../snackbars/SuccessSnackbar";
import ErrorSnackbar from "../../snackbars/ErrorSnackbar";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import DatetimeInput from "../../inputs/DatetimeInput/DatetimeInput";
import { getTimezoneDatetime } from "../../../utils/dateutils";
import { observer } from "mobx-react-lite";
import eventPageStore from "../store/eventPageStore";
import { EventActionsProps, EventViewProps } from "./interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import WarningDialogWithInputConfirmation from "../../WarningDialog/WarningDialogWithInputConfirmation";
import { Box } from "@mui/material";

interface EditEventFormProps extends EventViewProps, EventActionsProps {}

function EditEventForm(props: EditEventFormProps) {
    const event: EventResponseItemSchema = props.event;

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const navigateAfterPath: string | undefined = state ? state.navigateAfterPath : undefined;

    useEffect(() => {
        if (event) {
            setName(event.name);
            setDescription(event.description);
            setDeadline(event.endDate ? new Date(event.endDate) : null);
        }
    }, [event]);

    // данные события
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [deadline, setDeadline] = useState<Date | null>(null);

    // статус загрузки
    const [inProgress, setInProgress] = useState<boolean>(false);

    // состояние видимости окна подтверждения удаления
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

    const [isEditingFinished, setIsEditingFinished] = useState<boolean>(false);
    const [isEditingError, setIsEditingError] = useState<boolean>(false);
    const [deleteActionStatus, setDeleteActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    function dropEvent() {
        setDeleteActionStatus(FetchStatusEnum.FETCHING);

        API.events
            .delete(event.id)
            .then(() => {
                setDeleteActionStatus(FetchStatusEnum.SUCCESS);
                navigate(-2);
                eventPageStore.delete(event.id);
            })
            .catch(() => {
                setDeleteActionStatus(FetchStatusEnum.ERROR);
            });
    }

    function editEventHandler() {
        setInProgress(true);
        const newEventData: EditEventRequestSchema = {
            eventId: event.id,
            name: name,
            description: description,
            endDate: deadline ? getTimezoneDatetime(deadline) : undefined,
        };

        API.events
            .editEvent(newEventData)
            .then((data: EventResponseItemSchema) => {
                eventPageStore.update({ ...data, files: event.files });
                setIsEditingFinished(true);
                if (navigateAfterPath) {
                    navigate(navigateAfterPath);
                } else {
                    props.navigateToFull(undefined);
                }
            })
            .catch(() => {
                setIsEditingError(true);
            })
            .finally(() => {
                setInProgress(false);
            });
    }

    const handleCloseEditSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsEditingFinished(false);
    };

    const handleCloseErrorSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsEditingError(false);
    };

    return (
        <Box>
            <FormHeader text="Изменение события" />

            <FormInputItemWrapper>
                <TextField
                    required
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Название события"
                />
            </FormInputItemWrapper>

            <FormInputItemWrapper>
                <MultilineTextInput
                    value={description}
                    handleChange={setDescription}
                    label="Описание события"
                    maxLength={5000}
                />
            </FormInputItemWrapper>

            <FormInputItemWrapper>
                <DatetimeInput datetime={deadline} setDatetime={setDeadline} required />
            </FormInputItemWrapper>

            <LoadingButton fullWidth onClick={editEventHandler} loading={inProgress} variant="contained" sx={{ my: 2 }}>
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
                Удалить событие
            </LoadingButton>

            <SuccessSnackbar handleClose={handleCloseEditSnackbar} isOpen={isEditingFinished}>
                Изменения сохранены!
            </SuccessSnackbar>
            <ErrorSnackbar handleClose={handleCloseErrorSnackbar} isOpen={isEditingError}>
                Не удалось сохранить изменения!
            </ErrorSnackbar>

            <WarningDialogWithInputConfirmation
                controlValue={event.name}
                handleAgree={dropEvent}
                open={openDeleteConfirm}
                setOpen={setOpenDeleteConfirm}
                title="Удаление события"
                text={`Для удаления события введите`}
            />
        </Box>
    );
}

export default observer(EditEventForm);
