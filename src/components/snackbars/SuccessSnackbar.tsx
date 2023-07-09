import Snackbar from "@mui/material/Snackbar";
import React from "react";
import MySnackbarProps, { SnackbarAlert } from "./MySnackbar";

export default function SuccessSnackbar(props: MySnackbarProps) {
    return (
        <>
            <Snackbar open={props.isOpen} autoHideDuration={3000} onClose={props.handleClose}>
                <SnackbarAlert onClose={props.handleClose} severity="success" sx={{ width: "100%" }}>
                    {props.children}
                </SnackbarAlert>
            </Snackbar>
        </>
    );
}
