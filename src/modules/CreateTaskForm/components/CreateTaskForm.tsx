import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import React from "react";
import FormHeader from "../../../components/FormHeader/FormHeader";
import MultilineTextInput from "../../../components/inputs/MultilineTextInput/MultilineTextInput";
import DatetimeInput from "../../../components/inputs/DatetimeInput/DatetimeInput";
import SimpleTextInput from "../../../components/inputs/SimpleTextInput";
import createTaskStore from "../store/createTaskStore";
import LoadingButton from "@mui/lab/LoadingButton";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import UnitSelector from "../../../components/selectors/UnitSelector/UnitSelector";
import UsersSelector from "../../../components/selectors/UsersSelector";
import EventSelector from "../../../components/selectors/EventSelector/EventSelector";
import ModalForm from "../../../components/common/ModalForm";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import TextHelp from "../../../ui/TextHelp/TextHelp";
import { Uploader } from "../../Files";
import { FileOwnerTypesEnum } from "../../../enums/filesEnums";
import taskStore from "../../../store/TaskStore";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const CreateTaskForm = observer(() => {
    return (
        <ModalForm isOpen={createTaskStore.getIsOpen}>
            <Box>
                <FormHeader text="Новая задача" onClick={() => createTaskStore.setIsOpen(false)} />

                <SimpleTextInput
                    value={createTaskStore.getName}
                    onChange={(e) => createTaskStore.setName(e.target.value)}
                    label="Название задачи"
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    size="small"
                />

                <MultilineTextInput
                    label="Подробное описание"
                    value={createTaskStore.getDescription}
                    handleChange={(desc) => createTaskStore.setDescription(desc)}
                    maxLength={5000}
                />

                <Box sx={{ mb: 3 }}>
                    <DatetimeInput
                        datetime={createTaskStore.getDeadline || null}
                        setDatetime={(dt: Date | null) => createTaskStore.setDeadline(dt || undefined)}
                        required
                    />
                </Box>

                <FormGroup row sx={{ alignItems: "center" }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={createTaskStore.getIsPrivate}
                                onChange={(e) => createTaskStore.setIsPrivate(e.target.checked)}
                            />
                        }
                        label="Создать для себя"
                    />
                    <TextHelp title="Задачи для себя не отображаются в отделе и не привязаны к событию." />
                </FormGroup>

                {createTaskStore.getProcess && (
                    <Typography sx={{ mb: 1 }}>
                        Задача к процессу: <Link>{createTaskStore.getProcess?.name}</Link>
                    </Typography>
                )}

                <Box sx={{ mb: 2 }}>
                    <EventSelector
                        setInputValue={(event) => createTaskStore.setEvent(event)}
                        inputValue={createTaskStore.getEvent || null}
                        disabled={createTaskStore.getIsPrivate}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <UnitSelector
                        setInputValue={(unit) => createTaskStore.setUnit(unit)}
                        inputValue={createTaskStore.getUnit || null}
                        disabled={createTaskStore.getIsPrivate}
                    />
                </Box>

                <UsersSelector
                    setInputValue={(executors) => createTaskStore.setExecutors(executors)}
                    inputValue={createTaskStore.getExecutors}
                    label="Выберите исполнителей"
                    disabled={createTaskStore.getIsPrivate}
                />

                <Uploader
                    destType={FileOwnerTypesEnum.TASK}
                    destId={createTaskStore.getId}
                    successHandler={() => {
                        if (createTaskStore.getId !== undefined) {
                            taskStore.fetchById(createTaskStore.getId);
                            createTaskStore.cleanAfterLoading();
                        }
                    }}
                    saveFromCreate={true}
                />

                <LoadingButton
                    fullWidth
                    disabled={!createTaskStore.getIsTaskDataValid}
                    onClick={() => createTaskStore.createTask()}
                    loading={createTaskStore.getRequestStatus === FetchStatusEnum.FETCHING}
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Создать
                </LoadingButton>

                <ErrorSnackbar
                    handleClose={() => createTaskStore.setRequestStatus(FetchStatusEnum.IDLE)}
                    isOpen={createTaskStore.getRequestStatus === FetchStatusEnum.ERROR}
                >
                    Не удалось создать задачу!
                </ErrorSnackbar>
            </Box>
        </ModalForm>
    );
});

export default CreateTaskForm;
