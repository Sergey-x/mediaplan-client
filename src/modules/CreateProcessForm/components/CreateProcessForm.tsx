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
import { createProcessStore } from "../index";
import processStore from "../../Processes/store/ProcessStore";

const CreateProcessForm = observer(() => {
    return (
        <ModalForm isOpen={createProcessStore.getIsOpen}>
            <Box>
                <FormHeader text="Новый процесс" onClick={() => createProcessStore.setIsOpen(false)} />

                <SimpleTextInput
                    value={createProcessStore.getName}
                    onChange={(e) => createProcessStore.setName(e.target.value)}
                    label="Название процесса"
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    size="small"
                />

                <MultilineTextInput
                    label="Подробное описание"
                    value={createProcessStore.getDescription}
                    handleChange={(desc) => createProcessStore.setDescription(desc)}
                    maxLength={5000}
                />

                <Box sx={{ mb: 3 }}>
                    <DatetimeInput
                        datetime={createProcessStore.getDeadline || null}
                        setDatetime={(dt: Date | null) => createProcessStore.setDeadline(dt || undefined)}
                    />
                </Box>

                <Uploader
                    destType={FileOwnerTypesEnum.PROCESS}
                    destId={createProcessStore.getId}
                    successHandler={() => {
                        if (createProcessStore.getId !== undefined) {
                            processStore.fetchProcessById(createProcessStore.getId);
                            createProcessStore.cleanAfterLoading();
                        }
                    }}
                    saveFromCreate={true}
                />

                <LoadingButton
                    fullWidth
                    disabled={!createProcessStore.getIsDataValid}
                    onClick={() => createProcessStore.create()}
                    loading={createProcessStore.getRequestStatus === FetchStatusEnum.FETCHING}
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Создать
                </LoadingButton>

                <ErrorSnackbar
                    handleClose={() => createProcessStore.setRequestStatus(FetchStatusEnum.IDLE)}
                    isOpen={createProcessStore.getRequestStatus === FetchStatusEnum.ERROR}
                >
                    Не удалось создать процесс!
                </ErrorSnackbar>
            </Box>
        </ModalForm>
    );
});

export default CreateProcessForm;
