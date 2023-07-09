import React, { FormEvent, useState } from "react";
import { validateEmailFormat } from "../../../utils/validateEmail";
import { API } from "../../../api/api";
import { ResetPasswordEmailRequestSchema } from "../../../api/schemas/requests/auth";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import Typography from "@mui/material/Typography";
import EmailInput from "../../../components/inputs/EmailInput";
import { useNavigate } from "react-router-dom";
import { loginPath } from "../../../routes/paths";

export default function ForgotPasswordForm() {
    /*
     * Форма отправки email для сброса пароля.
     * */
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");

    const [actionStatus, setActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    function onInputResetEmail(event: FormEvent) {
        event.preventDefault();

        setActionStatus(FetchStatusEnum.FETCHING);
        const resetData: ResetPasswordEmailRequestSchema = {
            email: email,
        };

        API.auth
            .sendResetPswEmail(resetData)
            .then(() => {
                setActionStatus(FetchStatusEnum.SUCCESS);
            })
            .catch(() => {
                setActionStatus(FetchStatusEnum.ERROR);
            });
    }

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography>Введите Ваш email для восстановления доступа</Typography>

                    <EmailInput email={email} setEmail={setEmail} />

                    {actionStatus === FetchStatusEnum.SUCCESS && (
                        <>
                            <Typography>
                                На Ваше почту
                                <Typography variant="overline" sx={{ fontWeight: "bold" }}>
                                    &nbsp;{email}&nbsp;
                                </Typography>
                                в течении нескольких минут придет письмо.
                            </Typography>
                            <Typography>Следуйте инструкциям в этом письме.</Typography>

                            <LoadingButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => {
                                    navigate(loginPath);
                                }}
                            >
                                Вернуться на страницу входа
                            </LoadingButton>
                        </>
                    )}

                    <LoadingButton
                        disabled={
                            !Boolean(email) || !validateEmailFormat(email) || actionStatus !== FetchStatusEnum.IDLE
                        }
                        loading={actionStatus === FetchStatusEnum.FETCHING}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={onInputResetEmail}
                    >
                        Продолжить
                    </LoadingButton>
                </Box>
            </Container>
        </>
    );
}
