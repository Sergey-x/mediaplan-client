import { Box } from "@mui/material";
import React, { useEffect } from "react";
import MobileCalendarView from "./MobileCalendarView";
import DesktopCalendarView from "./DesktopCalendarView";
import { CalendarViewProps } from "./interfaces";
import Paper from "@mui/material/Paper";
import CalendarMenu from "../../CalendarMenu";
import CalendarTodayBar from "../../CalendarTodayBar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocaleText } from "../utils/calendarProps";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/ru";
import eventPageStore from "../../../components/events/store/eventPageStore";
import taskStore from "../../../store/TaskStore";
import { observer } from "mobx-react-lite";

const CalendarView = observer((props: CalendarViewProps) => {
    // Для перерисовки задач и событий на календаре после их изменения
    useEffect(() => {}, [eventPageStore.getEvents, taskStore.getTasks]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={{ ...LocaleText }}>
                <Box
                    sx={{
                        display: {
                            xs: "block",
                            md: "none",
                        },
                    }}
                >
                    <CalendarMenu />
                    <MobileCalendarView {...props} />
                    <CalendarTodayBar />
                </Box>
                <Box
                    sx={{
                        display: {
                            xs: "none",
                            md: "block",
                            position: "relative",
                            minWidth: "320px",
                        },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "stretch", justifyContent: "stretch" }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <DesktopCalendarView {...props} />
                        </Box>

                        <Box
                            sx={{
                                width: "300px",
                                mx: 0,
                                px: 0,
                                flexGrow: 1,
                                display: "flex",
                                alignItems: "stretch",
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    px: 0,
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    flexGrow: 1,
                                    alignItems: "stretch",
                                    justifyContent: "stretch",
                                }}
                            >
                                <CalendarMenu />
                                <CalendarTodayBar />
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </LocalizationProvider>
        </>
    );
});

export default CalendarView;
