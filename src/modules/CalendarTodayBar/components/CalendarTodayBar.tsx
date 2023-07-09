import React from "react";
import { useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import calendarStore from "../../../store/CalendarStore";
import { getDateRepresentation } from "../../../utils/dateutils";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import taskStore from "../../../store/TaskStore";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import TodayEvents from "./TodayEvents";
import TodayTasks from "./TodayTasks";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import eventPageStore from "../../../components/events/store/eventPageStore";

function CalendarTodayBar() {
    const theme = useTheme();

    // вкладки с задачами/событиями
    const [tab, setTab] = React.useState(0);

    const todayDateStr: string = calendarStore.getChosenDate ? getDateRepresentation(calendarStore.getChosenDate) : "";

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const dayTasks: TaskResponseItemSchema[] = taskStore.getDayTasks(calendarStore.getChosenDate);
    const dayEvents: EventResponseItemSchema[] = eventPageStore.getDayEvents(calendarStore.getChosenDate);

    return (
        <Box sx={{ maxHeight: "750px", overflowY: "auto", flexGrow: 1 }}>
            <Tabs
                value={tab}
                onChange={handleChangeTab}
                sx={{
                    width: "100%",
                    mb: 1,
                    "& .MuiTabs-indicator": {
                        backgroundColor: tab === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
                    },
                }}
            >
                <Tab label={`Задачи ${dayTasks.length ? `(${dayTasks.length})` : ""}`} sx={{ width: "50%" }} />
                <Tab
                    label={`События ${dayEvents.length ? `(${dayEvents.length})` : ""}`}
                    sx={{
                        width: "50%",
                        color: theme.palette.secondary.main,
                        borderColor: theme.palette.secondary.main,
                        "&.Mui-selected": {
                            color: theme.palette.secondary.main,
                            borderColor: theme.palette.secondary.main,
                        },
                        "&.Mui-focusVisible": {
                            backgroundColor: "rgba(100, 95, 228, 0.32)",
                            borderColor: theme.palette.secondary.main,
                        },
                    }}
                />
            </Tabs>

            {tab === 0 && <TodayTasks todayDateStr={todayDateStr} dayTasks={dayTasks} />}
            {tab === 1 && <TodayEvents todayDateStr={todayDateStr} dayEvents={dayEvents} />}
        </Box>
    );
}

export default observer(CalendarTodayBar);
