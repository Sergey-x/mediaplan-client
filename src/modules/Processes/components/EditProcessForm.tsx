import React, { useState } from "react";
import FormHeader from "../../../components/FormHeader/FormHeader";
import FormInputItemWrapper from "../../../components/FormInputItemWrapper";
import TextField from "@mui/material/TextField";
import MultilineTextInput from "../../../components/inputs/MultilineTextInput/MultilineTextInput";
import DatetimeInput from "../../../components/inputs/DatetimeInput/DatetimeInput";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { getTimezoneDatetime } from "../../../utils/dateutils";
import { API } from "../../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { EditProcessRequestSchema } from "../../../api/schemas/requests/processes";
import Box from "@mui/material/Box";
import { makeProcessLinkById, ProcessListPath } from "../../../routes/paths";
import { ProcessViewProps } from "./interfaces";
import processStore from "../store/ProcessStore";
import WarningDialogWithInputConfirmation from "../../../components/WarningDialog/WarningDialogWithInputConfirmation";
import { ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";

interface EditProcessFormProps extends ProcessViewProps {}

function EditProcessForm(props: EditProcessFormProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const navigateAfterPath: string | undefined = state ? state.navigateAfterPath : undefined;

    // данные нового процесса
    const [title, setTitle] = useState<string>(props.process.name);
    const [description, setDescription] = useState<string>(props.process.description);
    const [deadline, setDeadline] = useState<Date | null>(
        props.process.endDate ? new Date(props.process.endDate) : null
    );

    // состояние видимости окна подтверждения удаления
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

    // статус загрузки
    const [requestStatus, setRequestStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);
    const [deleteActionStatus, setDeleteActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    function dropProcess() {
        setDeleteActionStatus(FetchStatusEnum.FETCHING);

        API.process
            .delete(props.process.id)
            .then(() => {
                setDeleteActionStatus(FetchStatusEnum.SUCCESS);
                // Важно, сначала переместиться на страницу, а потом удалить из стора!
                navigate(ProcessListPath);
                processStore.delete(props.process.id);
            })
            .catch(() => {
                setDeleteActionStatus(FetchStatusEnum.ERROR);
            });
    }

    function editHandler() {
        setRequestStatus(FetchStatusEnum.FETCHING);

        const newProcessData: EditProcessRequestSchema = {
            processId: props.process.id,
            name: title,
            description: description,
            endDate: deadline ? getTimezoneDatetime(deadline) : null,
        };

        API.process
            .edit(newProcessData)
            .then((data: ProcessResponseItemSchema) => {
                setRequestStatus(FetchStatusEnum.SUCCESS);
                processStore.update({ ...data, files: props.process.files });
                if (navigateAfterPath) {
                    navigate(navigateAfterPath);
                } else {
                    navigate(makeProcessLinkById(props.process.id));
                }
            })
            .catch(() => {
                setRequestStatus(FetchStatusEnum.ERROR);
            });
    }

    const handleCloseErrorSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setRequestStatus(FetchStatusEnum.IDLE);
    };

    return (
        <>
            <Box sx={{ p: 1 }}>
                <FormHeader text="Изменение процесса" />

                <FormInputItemWrapper>
                    <TextField
                        size="small"
                        required
                        fullWidth
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        label="Название процесса"
                    />
                </FormInputItemWrapper>

                <FormInputItemWrapper>
                    <MultilineTextInput
                        value={description}
                        handleChange={setDescription}
                        label="Описание процесса"
                        maxLength={5000}
                    />
                </FormInputItemWrapper>

                <FormInputItemWrapper>
                    <DatetimeInput datetime={deadline} setDatetime={setDeadline} />
                </FormInputItemWrapper>

                <LoadingButton
                    fullWidth
                    disabled={title.length === 0}
                    onClick={editHandler}
                    loading={requestStatus === FetchStatusEnum.FETCHING}
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Сохранить
                </LoadingButton>
            </Box>

            <LoadingButton
                onClick={() => setOpenDeleteConfirm(true)}
                type="submit"
                fullWidth
                color="error"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={deleteActionStatus === FetchStatusEnum.FETCHING}
            >
                Удалить
            </LoadingButton>

            <ErrorSnackbar handleClose={handleCloseErrorSnackbar} isOpen={requestStatus === FetchStatusEnum.ERROR}>
                Не удалось изменить процесс!
            </ErrorSnackbar>

            {props.process && (
                <WarningDialogWithInputConfirmation
                    controlValue={props.process.name}
                    handleAgree={dropProcess}
                    open={openDeleteConfirm}
                    setOpen={setOpenDeleteConfirm}
                    title="Удаление процесса"
                    text="Для удаления процесса введите"
                />
            )}
        </>
    );
}

export default observer(EditProcessForm);
