import { observer } from "mobx-react-lite";
import { UserSchema } from "../../../api/schemas/responses/users";
import authUserStore from "../../../store/AuthUserStore";
import * as React from "react";
import { useState } from "react";
import { UpdateUserInfoRequestSchema } from "../../../api/schemas/requests/users";
import { API } from "../../../api/api";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SuccessSnackbar from "../../../components/snackbars/SuccessSnackbar";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import TextHelp from "../../../ui/TextHelp/TextHelp";
import Box from "@mui/material/Box";

const UserPersonalDataManager = observer(() => {
    // текущий пользователь
    const user: UserSchema | undefined = authUserStore.getMe;

    // данные пользователя
    const [firstName, setFirstName] = useState<string>(user?.firstName || "");
    const [lastName, setLastName] = useState<string>(user?.lastName || "");
    const [patronymic, setPatronymic] = useState<string>(user?.patronymic || "");
    const [isAdmin, setIdAdmin] = useState<boolean>(user?.isAdmin || false);

    // статус запроса на обновление данных
    const [isEditPersonalDataInProgress, setIsEditPersonalDataInProgress] = useState<boolean>(false);
    const [isEditPersonalDataSuccess, setIsEditPersonalDataSuccess] = useState<boolean>(false);
    const [isEditPersonalDataError, setIsEditPersonalDataError] = useState<boolean>(false);

    function editPersonalDataHandler(e: React.MouseEvent) {
        /* Обработчик обновления ФИО. */
        e.preventDefault();
        if (!user?.id) {
            setIsEditPersonalDataError(true);
            return;
        }

        setIsEditPersonalDataInProgress(true);
        const newUserData: UpdateUserInfoRequestSchema = {
            userId: user.id,
            firstName: firstName,
            lastName: lastName,
            patronymic: patronymic,
            isAdmin: isAdmin,
        };
        API.users
            .updateUserInfo(user?.id, newUserData)
            .then(() => {
                setIsEditPersonalDataSuccess(true);
                authUserStore.prefetchMe();
            })
            .catch(() => {
                setIsEditPersonalDataError(true);
            })
            .finally(() => {
                setIsEditPersonalDataInProgress(false);
            });
    }

    const handleChangeIsAdminSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIdAdmin(event.target.checked);
    };

    const handleCloseSuccessEditPersonalSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsEditPersonalDataSuccess(false);
    };
    const handleCloseErrorEditPersonalSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setIsEditPersonalDataError(false);
    };

    let warningText: string = "";
    if (!firstName && !lastName) warningText = "Укажите Ваше имя и фамилию!";
    else if (!firstName && lastName) warningText = "Укажите Ваше имя!";
    else if (firstName && !lastName) warningText = "Укажите Вашу фамилию!";
    return (
        <>
            <Typography variant="h6" component="h2" sx={{ mt: 3 }}>
                Данные пользователя
            </Typography>
            <Divider />

            {warningText && <Alert severity="error">{warningText}</Alert>}

            <TextField
                size="small"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value.trim())}
                margin="dense"
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Имя"
                sx={{ mt: 2 }}
                inputProps={{ maxLength: 50 }}
            />
            <TextField
                size="small"
                value={lastName}
                onChange={(e) => setLastName(e.target.value.trim())}
                margin="dense"
                required
                fullWidth
                id="lastName"
                label="Фамилия"
                name="lastName"
                autoComplete="family-name"
                inputProps={{ maxLength: 50 }}
            />
            <TextField
                size="small"
                value={patronymic}
                onChange={(e) => setPatronymic(e.target.value.trim())}
                margin="dense"
                fullWidth
                id="lastName"
                label="Отчество"
                name="lastName"
                autoComplete="family-name"
                inputProps={{ maxLength: 50 }}
            />

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <FormControlLabel
                    control={<Switch defaultChecked checked={isAdmin} onChange={handleChangeIsAdminSwitch} />}
                    label="Я хочу получать больше оповещений"
                />
                <TextHelp title="Вы будете получать оповещения обо всех задачах и событиях! Вы уверены?" />
            </Box>

            <LoadingButton
                onClick={editPersonalDataHandler}
                loading={isEditPersonalDataInProgress}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Сохранить
            </LoadingButton>

            <SuccessSnackbar handleClose={handleCloseSuccessEditPersonalSnackbar} isOpen={isEditPersonalDataSuccess}>
                Данные успешно обновлены!
            </SuccessSnackbar>

            <ErrorSnackbar handleClose={handleCloseErrorEditPersonalSnackbar} isOpen={isEditPersonalDataError}>
                Произошла ошибка, попробуйте позже
            </ErrorSnackbar>
        </>
    );
});

export default UserPersonalDataManager;
