import React from "react";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import FormHeader from "../../../components/FormHeader/FormHeader";
import MultilineTextInput from "../../../components/inputs/MultilineTextInput/MultilineTextInput";
import DatetimeInput from "../../../components/inputs/DatetimeInput/DatetimeInput";
import SimpleTextInput from "../../../components/inputs/SimpleTextInput";
import LoadingButton from "@mui/lab/LoadingButton";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import ModalForm from "../../../components/common/ModalForm";
import { Uploader } from "../../Files";
import { FileOwnerTypesEnum } from "../../../enums/filesEnums";
import { createEventStore } from "../index";
import eventPageStore from "../../../components/events/store/eventPageStore";

const CreateEventForm = observer(() => {
    return (
        <ModalForm isOpen={createEventStore.getIsOpen}>
            <Box>
                <FormHeader text="Новое событие" onClick={() => createEventStore.setIsOpen(false)} />

                <SimpleTextInput
                    value={createEventStore.getName}
                    onChange={(e) => createEventStore.setName(e.target.value)}
                    label="Название события"
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    size="small"
                />

                <MultilineTextInput
                    label="Подробное описание"
                    value={createEventStore.getDescription}
                    handleChange={(desc) => createEventStore.setDescription(desc)}
                    maxLength={5000}
                />

                <Box sx={{ mb: 3 }}>
                    <DatetimeInput
                        datetime={createEventStore.getDeadline || null}
                        setDatetime={(dt: Date | null) => createEventStore.setDeadline(dt || undefined)}
                        required
                    />
                </Box>

                <Uploader
                    destType={FileOwnerTypesEnum.EVENT}
                    destId={createEventStore.getId}
                    successHandler={() => {
                        if (createEventStore.getId !== undefined) {
                            eventPageStore.fetchById(createEventStore.getId);
                            createEventStore.cleanAfterLoading();
                        }
                    }}
                    saveFromCreate={true}
                />

                <LoadingButton
                    fullWidth
                    disabled={!createEventStore.getIsDataValid}
                    onClick={() => createEventStore.create()}
                    loading={createEventStore.getRequestStatus === FetchStatusEnum.FETCHING}
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Создать
                </LoadingButton>

                <ErrorSnackbar
                    handleClose={() => createEventStore.setRequestStatus(FetchStatusEnum.IDLE)}
                    isOpen={createEventStore.getRequestStatus === FetchStatusEnum.ERROR}
                >
                    Не удалось создать событие!
                </ErrorSnackbar>
            </Box>
        </ModalForm>
    );
});

export default CreateEventForm;
