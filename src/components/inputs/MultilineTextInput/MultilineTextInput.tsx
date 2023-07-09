import React from "react";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

interface MultilineTextInputProps {
    label?: string;
    value: string;
    handleChange: (value: string) => void;
    className?: string;
    maxLength?: number;
}

export default function MultilineTextInput(props: MultilineTextInputProps) {
    return (
        <>
            <TextField
                size="small"
                id="outlined-multiline-static"
                label={props.label}
                multiline
                rows={4}
                variant="outlined"
                value={props.value}
                onChange={(e) => props.handleChange(e.target.value)}
                fullWidth={true}
                className={props.className || ""}
                inputProps={{
                    maxLength: props.maxLength,
                }}
            />

            {props.maxLength && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                    {props.value.length}/{props.maxLength} символов
                </Typography>
            )}
        </>
    );
}
