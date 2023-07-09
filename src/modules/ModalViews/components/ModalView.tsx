import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import React from "react";

interface ModalViewProps {
    children?: any;
    isOpen: boolean;
    close?: () => void;
}

export default function ModalView(props: ModalViewProps) {
    const navigate = useNavigate();

    const closeModal = () => {
        navigate(-1);
    };

    return (
        <>
            <Modal
                open={props.isOpen}
                onClose={closeModal}
                sx={{
                    margin: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    maxWidth: "500px",
                    overflowY: "auto",

                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    msOverflowStyle: "none" /* IE and Edge */,
                    scrollbarWidth: "none" /* Firefox */,
                }}
            >
                <Box sx={{ background: "white", p: 2, borderRadius: 1, maxWidth: "100%" }}>
                    <Outlet />
                </Box>
            </Modal>
        </>
    );
}
