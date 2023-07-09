import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseFormIcon, { CloseFormIconProps } from "../../ui/CloseFormIcon";

interface ScreenHeaderProps extends CloseFormIconProps {
    text: string;
}

export default function FormHeader(props: ScreenHeaderProps) {
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", position: "relative", pb: 2 }}>
                <Typography sx={{ fontWeight: "bold" }}>{props.text}</Typography>
                <CloseFormIcon onClick={props.onClick} />
            </Box>
        </>
    );
}
