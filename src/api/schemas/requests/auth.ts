export interface SignInRequestSchema {
    email: string;
    password: string;
}

export interface SignUpRequestSchema {
    email: string;
    password: string;
    passPhrase: string;
}

export interface ResetPasswordEmailRequestSchema {
    email: string;
}

export interface CreateNewPasswordRequestSchema {
    password: string;
}
