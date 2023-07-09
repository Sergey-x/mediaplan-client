import React from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

interface ModalFormProps {
    children?: any;
    isOpen: boolean;
}

const ModalForm = (props: ModalFormProps) => {
    if (!props.isOpen) return null;

    return (
        <Modal
            open={props.isOpen}
            sx={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                minWidth: "300px",
                width: { xs: "100%", md: "55%", lg: "40%" },
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                msOverflowStyle: "none" /* IE and Edge */,
                scrollbarWidth: "none" /* Firefox */,
            }}
        >
            <Box sx={{ background: "white", p: { xs: 1, md: 2 }, borderRadius: 1, width: "100%" }}>
                {props.children}
            </Box>
        </Modal>
    );
};

export default ModalForm;
