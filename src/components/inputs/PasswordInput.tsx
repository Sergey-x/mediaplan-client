import * as React from "react";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import FormControl from "@mui/material/FormControl";

interface PasswordInputProps {
    password: string;
    setPassword: (psw: string) => void;
    label?: string | undefined;
}

export default function PasswordInput(props: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">{props.label || "Пароль"}</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={props.password}
                onChange={(e) => props.setPassword(e.target.value)}
                required
                fullWidth
                label="Пароль"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );
}
