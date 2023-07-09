import React from "react";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import FormHeader from "../../../components/FormHeader/FormHeader";
import MultilineTextInput from "../../../components/inputs/MultilineTextInput/MultilineTextInput";
import SimpleTextInput from "../../../components/inputs/SimpleTextInput";
import LoadingButton from "@mui/lab/LoadingButton";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import ModalForm from "../../../components/common/ModalForm";
import { createUnitStore } from "../index";
import FormInputItemWrapper from "../../../components/FormInputItemWrapper";
import InputColor from "../../../components/inputs/ColorInput";
import UserSelector from "../../../components/selectors/UserSelector/UserSelector";
import userStore from "../../../store/UserStore";
import UsersSelector from "../../../components/selectors/UsersSelector";

const CreateUnitForm = observer(() => {
    return (
        <ModalForm isOpen={createUnitStore.getIsOpen}>
            <Box>
                <FormHeader text="Новый отдел" onClick={() => createUnitStore.setIsOpen(false)} />

                <SimpleTextInput
                    value={createUnitStore.getName}
                    onChange={(e) => createUnitStore.setName(e.target.value)}
                    label="Название отдела"
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                    size="small"
                />

                <MultilineTextInput
                    label="Подробное описание"
                    value={createUnitStore.getDescription}
                    handleChange={(desc) => createUnitStore.setDescription(desc)}
                    maxLength={5000}
                />

                <FormInputItemWrapper className="d-flex align-items-center">
                    <span>Цвет отображения задач</span>
                    <InputColor
                        color={createUnitStore.getColor}
                        setColor={(color) => createUnitStore.setColor(color)}
                        className="mx-3"
                    />
                </FormInputItemWrapper>

                <UserSelector
                    label="Выберите руководителя отдела"
                    className="mt-2"
                    setInputValue={(admin) => createUnitStore.setAdmin(admin || undefined)}
                    inputValue={createUnitStore.getAdmin || null}
                    disabledUserIds={userStore.getUnitedUserIds}
                />

                <UsersSelector
                    label="Добавить сотрудников"
                    className="mt-2"
                    setInputValue={(members) => createUnitStore.setMembers(members)}
                    inputValue={createUnitStore.getMembers}
                    disabledUserIds={userStore.getUnitedUserIds}
                />

                <LoadingButton
                    fullWidth
                    disabled={!createUnitStore.getIsDataValid}
                    onClick={() => createUnitStore.create()}
                    loading={createUnitStore.getRequestStatus === FetchStatusEnum.FETCHING}
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Создать
                </LoadingButton>

                <ErrorSnackbar
                    handleClose={() => createUnitStore.setRequestStatus(FetchStatusEnum.IDLE)}
                    isOpen={createUnitStore.getRequestStatus === FetchStatusEnum.ERROR}
                >
                    Не удалось создать отдел!
                </ErrorSnackbar>
            </Box>
        </ModalForm>
    );
});

export default CreateUnitForm;
