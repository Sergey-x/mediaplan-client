/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from "react-router-dom";

import React, { useEffect } from "react";
import PrimaryAppBar from "../modules/PrimaryAppBar";
import { Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import authUserStore from "../store/AuthUserStore";
import { CreateTaskForm } from "../modules/CreateTaskForm";
import { CreateEventForm } from "../modules/CreateEventForm";
import { CreateProcessForm } from "../modules/CreateProcessForm";
import { CreateUnitForm } from "../modules/CreateUnitForm";

export default function App() {
    useEffect(() => {
        authUserStore.prefetchMe();
    }, []);

    return (
        <div className="h-100 container-fluid m-0 p-0 px-2">
            <Box sx={{ paddingBottom: 1 }}>
                <PrimaryAppBar />
            </Box>
            <Toolbar />
            <Outlet />
            <CreateTaskForm />
            <CreateEventForm />
            <CreateProcessForm />
            <CreateUnitForm />
        </div>
    );
}
