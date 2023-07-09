import React, { FormEvent, useEffect, useState } from "react";
import { CreateNewPasswordRequestSchema } from "../../../api/schemas/requests/auth";
import { API } from "../../../api/api";
import { MinPasswordLength } from "../../../consts";
import ErrorMsg from "../../../ui/ErrorMsg";
import LoadingButton from "@mui/lab/LoadingButton";
import PasswordInput from "../../../components/inputs/PasswordInput";
import Box from "@mui/material/Box";
import { UserSchema } from "../../../api/schemas/responses/users";
import authUserStore from "../../../store/AuthUserStore";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SuccessSnackbar from "../../../components/snackbars/SuccessSnackbar";
import ErrorSnackbar from "../../../components/snackbars/ErrorSnackbar";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { PasswordErrors } from "../../../consts/common";

export default function NewPasswordForm() {
    /*
     * Форма для создания пароля после сброса.
     * */
    const [password, setPassword] = useState<string | undefined>();
    const [password2, setPassword2] = useState<string | undefined>();
    const [isPasswordsMatch, setIsPasswordsMatch] = useState<boolean | undefined>();
    const [isPasswordHasGoodLen, setIsPasswordHasGoodLen] = useState<boolean | undefined>();
    const [isPasswordsOK, setIsPasswordsOK] = useState<boolean | undefined>();

    const [actionStatus, setActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    useEffect(() => {
        // Если пароли еще не изменялись
        if (password === undefined && password2 === undefined) return;

        // Если пароль короткий
        if (password && password.length < MinPasswordLength) {
            setIsPasswordHasGoodLen(false);
            return;
        }
        setIsPasswordHasGoodLen(true);

        // пользователь еще не начал вводить второй пароль
        if (password2 === undefined) return;

        // Если пароли не совпадают
        if (password !== password2) {
            setIsPasswordsMatch(false);
            return;
        }
        setIsPasswordsMatch(true);
    }, [password, password2]);

    useEffect(() => {
        if (isPasswordHasGoodLen === undefined || isPasswordsMatch === undefined) {
            setIsPasswordsOK(undefined);
        }
        setIsPasswordsOK(isPasswordHasGoodLen && isPasswordsMatch);
    }, [isPasswordsMatch, isPasswordHasGoodLen]);

    function onInputNewPassword(event: FormEvent) {
        event.preventDefault();

        if (!password || !password2) return;

        setActionStatus(FetchStatusEnum.FETCHING);
        const newPasswordData: CreateNewPasswordRequestSchema = {
            password: password,
        };

        API.auth
            .createNewPassword(newPasswordData)
            .then(() => {
                setActionStatus(FetchStatusEnum.SUCCESS);
                setPassword("");
                setPassword2("");
                API.users
                    .getMe()
                    .then((user: UserSchema) => authUserStore.update(user))
                    .catch(() => {});
            })
            .catch(() => {
                setActionStatus(FetchStatusEnum.ERROR);
            })
            .finally();
    }

    const resetActionStatus = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setActionStatus(FetchStatusEnum.IDLE);
    };

    return (
        <>
            <Typography variant="h6" component="h2" sx={{ mt: 3 }}>
                Смена пароля
            </Typography>
            <Divider />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{ mt: 2, width: "100%" }}>
                    <PasswordInput password={password || ""} setPassword={setPassword} label="Новый пароль" />
                </Box>
                <Box sx={{ mt: 2, width: "100%" }}>
                    <PasswordInput
                        password={password2 || ""}
                        setPassword={setPassword2}
                        label="Повторите новый пароль"
                    />
                </Box>

                <ErrorMsg
                    errText={PasswordErrors.PasswordsDontMatch}
                    visible={isPasswordsMatch !== undefined && !isPasswordsMatch}
                />
                <ErrorMsg
                    errText={PasswordErrors.PasswordsTooShort}
                    visible={isPasswordHasGoodLen !== undefined && !isPasswordHasGoodLen}
                />

                <LoadingButton
                    disabled={!isPasswordsOK}
                    loading={actionStatus === FetchStatusEnum.FETCHING}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={onInputNewPassword}
                >
                    Сохранить пароль
                </LoadingButton>
            </Box>

            <SuccessSnackbar handleClose={resetActionStatus} isOpen={actionStatus === FetchStatusEnum.SUCCESS}>
                Новый пароль сохранен!
            </SuccessSnackbar>

            <ErrorSnackbar handleClose={resetActionStatus} isOpen={actionStatus === FetchStatusEnum.ERROR}>
                Произошла ошибка, попробуйте позже
            </ErrorSnackbar>
        </>
    );
}
