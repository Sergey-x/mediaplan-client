import { observer } from "mobx-react-lite";
import { Box, useTheme } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import calendarStore from "../../../store/CalendarStore";
import { CalendarElemTypeEnum } from "../../../enums/common";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import React from "react";
import dayjs from "dayjs";
import taskStore from "../../../store/TaskStore";
import { compareTasks } from "../../../utils/taskUtils";
import eventPageStore from "../../../components/events/store/eventPageStore";
import { CustomDayRendererProps } from "./interfaces";

const MobileDaySx: any = {
    borderRadius: "50%",
    aspectRatio: "1",
    lineHeight: "1rem",
    fontSize: "0.8rem",
    textAlign: "center",
    m: 0,
    minWidth: { xs: "1.2em", sm: "1.5em", md: "2em" },
};

const MCDRenderer = (date: Date, selectedDays: Array<Date | null>, pickersDayProps: PickersDayProps<Date>) => {
    const today: Date = dayjs(date).toDate();

    const todayTasks: TaskResponseItemSchema[] = taskStore.getDayTasks(today).sort(compareTasks);
    const todayEvents: EventResponseItemSchema[] = eventPageStore.getDayEvents(today);

    return (
        <MobileCustomDayRenderer
            today={today}
            selectedDays={selectedDays}
            pickersDayProps={pickersDayProps}
            todayTasks={todayTasks}
            todayEvents={todayEvents}
        />
    );
};

export default MCDRenderer;

const MobileCustomDayRenderer = observer((props: CustomDayRendererProps) => {
    const theme = useTheme();

    const today: Date = props.today;
    const dayNumber: number = today.getDate();

    const todayTasks = props.todayTasks;
    const todayEvents = props.todayEvents;

    return (
        <Box key={today.toJSON()}>
            <PickersDay {...props.pickersDayProps}>
                <Box
                    sx={{
                        width: "100%",
                        p: 0,
                        pb: "2px",
                    }}
                >
                    {dayNumber}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            lineHeight: "1rem",
                            px: 1,
                        }}
                    >
                        {Boolean(
                            calendarStore.getElemsType !== CalendarElemTypeEnum.EVENT && todayTasks.length !== 0
                        ) && (
                            <Box
                                sx={{
                                    ...MobileDaySx,
                                    background: theme.palette.primary.main,
                                    color: theme.palette.getContrastText(theme.palette.primary.main),
                                }}
                            >
                                {todayTasks.length}
                            </Box>
                        )}
                        {Boolean(
                            calendarStore.getElemsType !== CalendarElemTypeEnum.TASK && todayEvents.length !== 0
                        ) && (
                            <Box
                                sx={{
                                    ...MobileDaySx,
                                    background: theme.palette.secondary.main,
                                    color: theme.palette.getContrastText(theme.palette.secondary.main),
                                }}
                            >
                                {todayEvents.length}
                            </Box>
                        )}
                    </Box>
                </Box>
            </PickersDay>
        </Box>
    );
});
