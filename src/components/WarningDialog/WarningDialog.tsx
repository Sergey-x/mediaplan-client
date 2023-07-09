import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface WarningDialogProps {
    open: boolean;
    setOpen: (val: boolean) => void;
    title: string;
    text?: string;
    handleAgree: () => void;
    agreeText?: string;
    disagreeText?: string;
}

export default function WarningDialog(props: WarningDialogProps) {
    return (
        <>
            <Dialog open={props.open} sx={{ minWidth: "300px" }}>
                <DialogTitle sx={{ minWidth: "300px" }}>{props.title}</DialogTitle>

                <DialogContent>{props.text && <DialogContentText>{props.text}</DialogContentText>}</DialogContent>

                <DialogActions sx={{ display: "flex", justifyContent: "stretch" }}>
                    <Button
                        onClick={() => {
                            props.setOpen(false);
                        }}
                        sx={{ mx: 2, flexGrow: 1 }}
                    >
                        {props.agreeText ? props.disagreeText : "Отменить"}
                    </Button>
                    <Button
                        onClick={() => {
                            props.handleAgree();
                            props.setOpen(false);
                        }}
                        color="error"
                        variant="contained"
                        sx={{ mx: 2, flexGrow: 1 }}
                    >
                        {props.agreeText ? props.agreeText : "Удалить"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
