import React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface MySnackbarProps {
    handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
    isOpen: boolean;
    children?: any;
}

export default MySnackbarProps;

export const SnackbarAlert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
