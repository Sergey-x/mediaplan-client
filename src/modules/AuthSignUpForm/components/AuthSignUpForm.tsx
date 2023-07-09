import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import EmailInput from "../../../components/inputs/EmailInput";
import { validateEmailFormat } from "../../../utils/validateEmail";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
import { RegisterFormErrors } from "../consts/consts";
import { SignUpRequestSchema } from "../../../api/schemas/requests/auth";
import { API } from "../../../api/api";
import { loginPath, successRegistrationPath } from "../../../routes/paths";
import ErrorMsg from "../../../ui/ErrorMsg";
import { MinPasswordLength, PasswordErrors, ServerAvailableErrors } from "../../../consts/common";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import PasswordInput from "../../../components/inputs/PasswordInput";
import SimpleTextInput from "../../../components/inputs/SimpleTextInput";

export default function AuthSignUpForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");

    const [password, setPassword] = useState<string | undefined>();
    const [password2, setPassword2] = useState<string | undefined>();
    const [secret, setSecret] = useState<string>("");
    const [isPasswordsMatch, setIsPasswordsMatch] = useState<boolean | undefined>();
    const [isPasswordHasGoodLen, setIsPasswordHasGoodLen] = useState<boolean | undefined>();
    const [isPasswordsOK, setIsPasswordsOK] = useState<boolean | undefined>();

    const [isFormDisabled, setIsFormDisabled] = useState(true);

    const [errorText, setErrorText] = useState<string>(RegisterFormErrors.EmailAlreadyExist);
    const [actionStatus, setActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    useEffect(() => {
        setActionStatus(FetchStatusEnum.IDLE);
    }, [password, password2, email]);

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

    useEffect(() => {
        setIsFormDisabled(!isPasswordsOK || !validateEmailFormat(email) || !secret);
    }, [isPasswordsOK, email, secret]);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (isFormDisabled) return;
        if (!password) return;

        setActionStatus(FetchStatusEnum.FETCHING);

        const signUpRequestData: SignUpRequestSchema = {
            email: email,
            password: password,
            passPhrase: secret,
        };
        API.auth
            .signUp(signUpRequestData)
            .then(() => {
                setPassword("");
                setActionStatus(FetchStatusEnum.SUCCESS);
                navigate(successRegistrationPath, { state: { email: email } });
            })
            .catch((err) => {
                setActionStatus(FetchStatusEnum.ERROR);

                const statusCode = err.status || err.response?.status || 500;
                if (statusCode >= 500) {
                    setErrorText(ServerAvailableErrors.ServiceUnavailable);
                } else if (statusCode >= 400) {
                    setErrorText(RegisterFormErrors.EmailAlreadyExist);
                }
            });
    }

    return (
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
                <Typography component="h1" variant="h5">
                    Зарегистрироваться
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container>
                        <EmailInput email={email} setEmail={setEmail} />

                        <Box sx={{ mt: 2, width: "100%" }}>
                            <PasswordInput password={password || ""} setPassword={setPassword} />
                        </Box>
                        <Box sx={{ mt: 2, width: "100%" }}>
                            <PasswordInput
                                password={password2 || ""}
                                setPassword={setPassword2}
                                label="Повторите пароль"
                            />
                        </Box>

                        <Box sx={{ mt: 2, width: "100%" }}>
                            <SimpleTextInput
                                label="Кодовая фраза"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                sx={{ mt: 1, width: "100%" }}
                                error={!Boolean(secret)}
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

                        <ErrorMsg errText={errorText} visible={actionStatus === FetchStatusEnum.ERROR} />
                    </Grid>

                    <LoadingButton
                        disabled={isFormDisabled}
                        loading={actionStatus === FetchStatusEnum.FETCHING}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Зарегистрироваться
                    </LoadingButton>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link
                                href={loginPath}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(loginPath);
                                }}
                                variant="body1"
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                Уже есть аккаунт? Войти
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
