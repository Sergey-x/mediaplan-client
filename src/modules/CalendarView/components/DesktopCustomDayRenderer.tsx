import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import taskStore from "../../../store/TaskStore";
import { compareTasks } from "../../../utils/taskUtils";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import eventPageStore from "../../../components/events/store/eventPageStore";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import TaskIcon from "@mui/icons-material/Task";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import calendarStore from "../../../store/CalendarStore";
import { CalendarElemTypeEnum } from "../../../enums/common";
import BaseEvent from "../../../components/events/BaseEvent";
import { ViewModeEnum } from "../../../enums/viewModEnum";
import BaseTask from "../../../components/tasks/BaseTask";
import React from "react";
import { observer } from "mobx-react-lite";
import { CustomDayRendererProps } from "./interfaces";

const MaxElemsInDay = 6;

const DCDRenderer = (date: Date, selectedDays: Array<Date | null>, pickersDayProps: PickersDayProps<Date>) => {
    const today: Date = dayjs(date).toDate();

    const todayTasks: TaskResponseItemSchema[] = taskStore.getDayTasks(today).sort(compareTasks);
    const todayEvents: EventResponseItemSchema[] = eventPageStore.getDayEvents(today);

    return (
        <DesktopCustomDayRenderer
            today={today}
            selectedDays={selectedDays}
            pickersDayProps={pickersDayProps}
            todayTasks={todayTasks}
            todayEvents={todayEvents}
        />
    );
};

export default DCDRenderer;

const DesktopCustomDayRenderer = observer((props: CustomDayRendererProps) => {
    const today: Date = props.today;
    const dayNumber: number = today.getDate();

    const todayTasks = props.todayTasks;
    const todayEvents = props.todayEvents;

    const MaxTodayTasks: number = MaxElemsInDay - Math.min(todayEvents.length, Math.floor(MaxElemsInDay / 2));
    const MaxTodayEvents: number = MaxElemsInDay - Math.min(todayTasks.length, Math.floor(MaxElemsInDay / 2));

    return (
        <Box key={today.toJSON()} sx={{ minHeight: dayNumber === new Date().getDate() ? "100px" : 0 }}>
            <PickersDay {...props.pickersDayProps}>
                <Box
                    sx={{
                        width: "100%",
                        px: "3px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "stretch",
                        alignItems: "stretch",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "stretch" }}>
                        {dayNumber}
                        <Box sx={{ flexGrow: 1, textAlign: "right" }}>
                            {todayTasks.length > MaxTodayTasks && (
                                <Typography variant="caption" sx={{ fontSize: "0.9rem", px: 1 }}>
                                    +{todayTasks.length - MaxTodayTasks} <TaskIcon color="primary" />
                                </Typography>
                            )}
                            {todayEvents.length > MaxTodayEvents && (
                                <Typography variant="caption" sx={{ fontSize: "0.9rem", px: 1 }}>
                                    +{todayEvents.length - MaxTodayEvents} <LocalActivityIcon color="secondary" />
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {calendarStore.getElemsType !== CalendarElemTypeEnum.TASK &&
                        todayEvents
                            .slice(0, MaxTodayEvents)
                            .map((event) => (
                                <BaseEvent key={event.id} event={event} viewMode={ViewModeEnum.CALENDAR} />
                            ))}

                    {calendarStore.getElemsType !== CalendarElemTypeEnum.EVENT &&
                        todayTasks
                            .slice(0, MaxTodayTasks)
                            .map((task) => <BaseTask key={task.id} task={task} viewMode={ViewModeEnum.CALENDAR} />)}
                </Box>
            </PickersDay>
        </Box>
    );
});
