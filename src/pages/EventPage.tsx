import { observer } from "mobx-react-lite";
import ListViewContainer from "../components/ListViewContainer/ListViewContainer";
import React, { useEffect } from "react";
import PaginatedEventList from "../components/events/components/PaginatedEventList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { EventListPath } from "../routes/paths";
import { createEventStore } from "../modules/CreateEventForm";
import PlainSelector from "../components/selectors/PlainSelector";
import { StatusFilters } from "../enums/common";
import CreateNewButton from "../ui/CreateNewButton";
import { useTheme } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import eventPageStore from "../components/events/store/eventPageStore";

const TopBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        eventPageStore.resetPaginateStateStatus();
    }, [eventPageStore.getFilterStatus]);

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", my: 0, py: 0 }}>
                <Typography
                    component="h1"
                    variant="h1"
                    sx={{ fontSize: { xs: "1rem", md: "1.5rem" }, color: theme.palette.grey.A700, mb: 2, py: 1, my: 0 }}
                >
                    <Link
                        href={EventListPath}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(EventListPath);
                        }}
                    >
                        События
                    </Link>
                </Typography>
                <PlainSelector
                    filterValue={eventPageStore.getFilterStatus}
                    setFilterValue={(val) => {
                        navigate(EventListPath);
                        eventPageStore.setFilterStatus(val);
                    }}
                    id="event-filter"
                    filterObj={StatusFilters}
                />
            </Box>

            <CreateNewButton text="Новое событие" onClick={() => createEventStore.setIsOpen(true)} />
        </>
    );
};

const EventPage = observer(() => {
    return (
        <>
            <ListViewContainer TopBar={<TopBar />} LeftBar={<PaginatedEventList />} RightBar={<Outlet />} />
        </>
    );
});

export default EventPage;
