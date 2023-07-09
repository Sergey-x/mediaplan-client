import Box from "@mui/material/Box";
import ListViewContainer from "../components/ListViewContainer/ListViewContainer";
import { ProcessList } from "../modules/Processes";
import Typography from "@mui/material/Typography";
import { ProcessListPath } from "../routes/paths";
import { createProcessStore } from "../modules/CreateProcessForm";
import React from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import Link from "@mui/material/Link";
import ToggleStatusButton from "../modules/Processes/components/ToggleStatusButton";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import PlainSelector from "../components/selectors/PlainSelector";
import processStore from "../modules/Processes/store/ProcessStore";
import { observer } from "mobx-react-lite";
import { StatusFilters } from "../enums/common";

const TopBar = observer(() => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const urlParams = useParams();

    const processId: number = +(urlParams.processId || 0);

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", my: 0, py: 0 }}>
                <Typography
                    component="h1"
                    variant="h1"
                    sx={{ fontSize: { xs: "1rem", md: "1.5rem" }, color: theme.palette.grey.A700, mb: 2, py: 1, my: 0 }}
                >
                    <Link
                        href={ProcessListPath}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(ProcessListPath);
                        }}
                    >
                        Процессы
                    </Link>
                </Typography>
                <PlainSelector
                    filterValue={processStore.getFilterStatus}
                    setFilterValue={(val) => {
                        navigate(ProcessListPath);
                        processStore.setFilterStatus(val);
                    }}
                    id="process-filter"
                    filterObj={StatusFilters}
                />
            </Box>

            {location.pathname === ProcessListPath && (
                <SpeedDial
                    ariaLabel={"create process task speed deal"}
                    sx={{ position: "absolute", bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon />}
                    onClick={() => createProcessStore.setIsOpen(true)}
                ></SpeedDial>
            )}

            {processId > 0 && <ToggleStatusButton processId={processId} />}
        </>
    );
});

export default function ProcessesPage() {
    return (
        <>
            <ListViewContainer LeftBar={<ProcessList />} RightBar={<Outlet />} TopBar={<TopBar />} />
        </>
    );
}
