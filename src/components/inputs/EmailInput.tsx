import React from "react";
import TextField from "@mui/material/TextField";
import { validateEmailFormat } from "../../utils/validateEmail";

interface EmailInputProps {
    email: string;
    setEmail: (email: string) => void;
}

export default function EmailInput(props: EmailInputProps) {
    function onChangeEmail(email: string) {
        const emailWithoutSpaces: string = email
            .split("")
            .filter((char) => char !== " ")
            .join("");

        props.setEmail(emailWithoutSpaces);
    }

    return (
        <TextField
            value={props.email}
            onChange={(e) => onChangeEmail(e.target.value)}
            error={Boolean(props.email && !validateEmailFormat(props.email))}
            margin="normal"
            type="email"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
        />
    );
}
