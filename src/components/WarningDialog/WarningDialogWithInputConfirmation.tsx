import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { useState } from "react";
import Typography from "@mui/material/Typography";

interface WarningDialogWithInputConfirmationProps {
    open: boolean;
    setOpen: (val: boolean) => void;
    controlValue: string;
    title: string;
    text?: string;
    handleAgree: () => void;
    agreeText?: string;
    disagreeText?: string;
}

export default function WarningDialogWithInputConfirmation(props: WarningDialogWithInputConfirmationProps) {
    const [confirmationValue, setConfirmationValue] = useState<string>("");

    function tryToDelete() {
        if (props.controlValue === confirmationValue) {
            props.handleAgree();
            props.setOpen(false);
        }
    }

    function abortDeleting() {
        props.setOpen(false);
    }

    return (
        <>
            <Dialog open={props.open} sx={{ minWidth: "300px" }}>
                <DialogTitle sx={{ minWidth: "300px" }}>{props.title}</DialogTitle>

                <DialogContent>
                    {props.text && (
                        <DialogContentText>
                            {props.text}{" "}
                            <Typography sx={{ fontWeight: "bold", color: "black" }}>"{props.controlValue}"</Typography>
                        </DialogContentText>
                    )}
                </DialogContent>

                <TextField
                    sx={{ px: 3 }}
                    size="small"
                    value={confirmationValue}
                    onChange={(e) => setConfirmationValue(e.target.value)}
                />
                <DialogActions sx={{ display: "flex", justifyContent: "stretch" }}>
                    <Button onClick={abortDeleting} sx={{ mx: 2, flexGrow: 1 }}>
                        {props.agreeText ? props.disagreeText : "Отменить"}
                    </Button>
                    <Button
                        onClick={tryToDelete}
                        color="error"
                        variant="contained"
                        sx={{ mx: 2, flexGrow: 1 }}
                        disabled={props.controlValue !== confirmationValue}
                    >
                        {props.agreeText ? props.agreeText : "Удалить"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
