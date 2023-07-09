import * as React from "react";
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import EmailInput from "../../../components/inputs/EmailInput";
import { validateEmailFormat } from "../../../utils/validateEmail";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { forgotPasswordPath, registrationPath } from "../../../routes/paths";
import ErrorMsg from "../../../ui/ErrorMsg";
import { SignInRequestSchema } from "../../../api/schemas/requests/auth";
import { API } from "../../../api/api";
import { TokenPair } from "../../../api/schemas/responses/auth";
import { ACCESS_TOKEN_STORAGE_NAME, REFRESH_TOKEN_STORAGE_NAME } from "../../../api/config";
import { UserSchema } from "../../../api/schemas/responses/users";
import { useNavigate } from "react-router-dom";
import authUserStore from "../../../store/AuthUserStore";
import { observer } from "mobx-react-lite";
import { LoginFormErrors } from "../consts/consts";
import { ServerAvailableErrors } from "../../../consts/common";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import PasswordInput from "../../../components/inputs/PasswordInput";

function AuthSignInForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorText, setErrorText] = useState<string>(LoginFormErrors.WrongCredentials);
    const [actionStatus, setActionStatus] = useState<FetchStatusStrings>(FetchStatusEnum.IDLE);

    useEffect(() => {
        setActionStatus(FetchStatusEnum.IDLE);
    }, [email, password]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setActionStatus(FetchStatusEnum.FETCHING);
        const signInRequestData: SignInRequestSchema = {
            email: email,
            password: password,
        };

        API.auth
            .signIn(signInRequestData)
            .then((tokens: TokenPair) => {
                setActionStatus(FetchStatusEnum.SUCCESS);
                localStorage.setItem(ACCESS_TOKEN_STORAGE_NAME, tokens.access);
                localStorage.setItem(REFRESH_TOKEN_STORAGE_NAME, tokens.refresh);

                API.users.getMe().then((user: UserSchema) => {
                    authUserStore.update(user);
                });
            })
            .catch((err) => {
                setActionStatus(FetchStatusEnum.ERROR);
                const statusCode = err.status || err.response?.status || 500;
                if (statusCode >= 500) {
                    setErrorText(ServerAvailableErrors.ServiceUnavailable);
                } else if (statusCode >= 400) {
                    setErrorText(LoginFormErrors.WrongCredentials);
                }
            });
    };

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
                    Войти
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <EmailInput email={email} setEmail={setEmail} />
                    <PasswordInput password={password} setPassword={setPassword} />

                    <ErrorMsg errText={errorText} visible={actionStatus === FetchStatusEnum.ERROR} />

                    <LoadingButton
                        type="submit"
                        fullWidth
                        loading={actionStatus === FetchStatusEnum.FETCHING}
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!email || !validateEmailFormat(email) || !password}
                    >
                        Войти
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link
                                href={forgotPasswordPath}
                                variant="body1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(forgotPasswordPath);
                                }}
                            >
                                Забыли пароль?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                href={registrationPath}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate(registrationPath);
                                }}
                                variant="body1"
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                Зарегистрироваться
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default observer(AuthSignInForm);
