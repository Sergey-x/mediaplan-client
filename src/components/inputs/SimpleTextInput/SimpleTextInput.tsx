import React from "react";
import { TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export type SimpleTextInputProps = TextFieldProps & {
    maxLength?: number;
    value: string;
};

const SimpleTextInput = (props: SimpleTextInputProps) => {
    return (
        <Box>
            <TextField {...props} />

            {props.maxLength && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {props.value.length}/{props.maxLength} символов
                </Typography>
            )}
        </Box>
    );
};

export default SimpleTextInput;
