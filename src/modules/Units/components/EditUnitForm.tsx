import React, { useEffect, useState } from "react";
import MultilineTextInput from "../../../components/inputs/MultilineTextInput/MultilineTextInput";
import UserSelector from "../../../components/selectors/UserSelector/UserSelector";
import { UpdateTeamRequestSchema } from "../../../api/schemas/requests/units";
import { API } from "../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import FormHeader from "../../../components/FormHeader/FormHeader";
import { UserSchema } from "../../../api/schemas/responses/users";
import UsersSelector from "../../../components/selectors/UsersSelector";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import SuccessSnackbar from "../../../components/snackbars/SuccessSnackbar";
import { observer } from "mobx-react-lite";
import userStore from "../../../store/UserStore";
import unitStore from "../../../store/UnitStore";
import { makeUnitLinkById, UnitListPath } from "../../../routes/paths";
import { TextField } from "@mui/material";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import WarningDialogWithInputConfirmation from "../../../components/WarningDialog/WarningDialogWithInputConfirmation";
import FormInputItemWrapper from "../../../components/FormInputItemWrapper";
import InputColor from "../../../components/inputs/ColorInput";

function subtractArrays(a: number[], b: number[]): number[] {
    return a.filter((n: number) => !b.includes(n));
}

const EditUnitForm = observer(() => {
    const navigate = useNavigate();
    const urlParams = useParams();

    // id отдела из пути
    const id: number = +(urlParams.id || 0);

    // данные отдела
    const unit = unitStore.getById(id);

    // данные отдела
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [unitHead, setUnitHead] = useState<UserSchema | null>(null);
    const [prevUnitMembers, setPrevUnitMembers] = useState<UserSchema[]>([]);
    const [unitMembers, setUnitMembers] = useState<UserSchema[]>([]);
    const [color, setColor] = useState<string>("");

    // состояние видимости окна подтверждения удаления
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

    const [actionStatus, setActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);
    const [deleteActionStatus, setDeleteActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    useEffect(() => {
        if (unit !== undefined) {
            setTitle(unit.name);
            setDescription(unit.description);
            setUnitHead(unit.admin);
            setColor(unit.color || "");
            setUnitMembers(unit.members);
            setPrevUnitMembers(unit.members);
        }
    }, [unit]);

    function dropUnit() {
        if (unit === undefined) return;
        setDeleteActionStatus(FetchStatusEnum.FETCHING);

        API.units
            .delete(unit.id)
            .then(() => {
                unitStore.delete(unit.id);
                setDeleteActionStatus(FetchStatusEnum.SUCCESS);
                navigate(UnitListPath);
            })
            .catch(() => {
                setDeleteActionStatus(FetchStatusEnum.ERROR);
            })
            .finally();
    }

    function editUnitHandler(event: React.MouseEvent) {
        event.preventDefault();
        if (!unit || !unitHead || !title) {
            return;
        }

        setActionStatus(FetchStatusEnum.FETCHING);

        const usersBefore = prevUnitMembers.map((user) => user.id);
        const usersAfter = unitMembers.map((user) => user.id);

        const newUnitData: UpdateTeamRequestSchema = {
            name: title,
            departmentId: id,
            description: description,
            adminId: unitHead?.id,
            newMembers: subtractArrays(usersAfter, usersBefore),
            membersToKick: subtractArrays(usersBefore, usersAfter),
            color: color || undefined,
        };

        API.units
            .update(newUnitData)
            .then(() => {
                API.units.getById(id).then((unit) => {
                    unitStore.update(unit.id, unit);
                });
                setActionStatus(FetchStatusEnum.SUCCESS);
                navigate(makeUnitLinkById(id));
            })
            .catch(() => {
                setActionStatus(FetchStatusEnum.ERROR);
            });
    }

    const resetActionStatus = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setActionStatus(FetchStatusEnum.IDLE);
    };

    return (
        <>
            <div>
                <FormHeader text="Изменение отдела" />

                <TextField
                    size="small"
                    label="Название отдела"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth={true}
                    sx={{ mt: 2 }}
                />

                <MultilineTextInput
                    value={description}
                    handleChange={setDescription}
                    label={"Описание"}
                    className="mt-2"
                    maxLength={5000}
                />
                <FormInputItemWrapper className="d-flex align-items-center">
                    <span>Цвет отображения задач</span>
                    <InputColor color={color} setColor={setColor} className="mx-3" />
                </FormInputItemWrapper>

                <UserSelector
                    label="Выберите руководителя отдела"
                    placeholder="Руководитель"
                    className="mt-2"
                    setInputValue={setUnitHead}
                    inputValue={unitHead}
                    disabledUserIds={userStore.getUnitedUserIds}
                />

                <UsersSelector
                    label="Добавить сотрудников"
                    placeholder="Сотрудники"
                    className="mt-2"
                    setInputValue={setUnitMembers}
                    inputValue={unitMembers}
                    disabledUserIds={userStore.getUnitedUserIds}
                />

                <LoadingButton
                    onClick={editUnitHandler}
                    loading={actionStatus === FetchStatusEnum.FETCHING}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={!unitHead || !title}
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
                    Удалить отдел
                </LoadingButton>
            </div>
            {unit && (
                <WarningDialogWithInputConfirmation
                    controlValue={unit.name}
                    handleAgree={dropUnit}
                    open={openDeleteConfirm}
                    setOpen={setOpenDeleteConfirm}
                    title="Удаление отдела"
                    text={`Для удаления отдела введите`}
                />
            )}

            <SuccessSnackbar handleClose={resetActionStatus} isOpen={actionStatus === FetchStatusEnum.SUCCESS}>
                Изменения сохранены!
            </SuccessSnackbar>

            <ErrorSnackbar handleClose={resetActionStatus} isOpen={actionStatus === FetchStatusEnum.ERROR}>
                Не удалось сохранить изменения!
            </ErrorSnackbar>
        </>
    );
});

export default EditUnitForm;
