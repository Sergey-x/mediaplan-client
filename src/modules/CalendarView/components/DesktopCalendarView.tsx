/* eslint-disable react-hooks/exhaustive-deps */
import { Box, SxProps, TextField, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { weekCount } from "../../../utils/dateutils";
import { StaticDatePicker } from "@mui/x-date-pickers";
import { observer } from "mobx-react-lite";
import calendarStore from "../../../store/CalendarStore";
import { CalendarViewProps } from "./interfaces";
import dayjs from "dayjs";
import BaseCalendarProps from "./BaseCalendarProps";
import DCDRenderer from "./DesktopCustomDayRenderer";

const MaxDateSize = 400; // максимальный размер отображаемого на десктопном календаре дня
const BaseDateHeight = 120; // базовая высота ячейки

export const minDate = new Date("2010-01-01");
export const maxDate = new Date("2050-01-01");

const DesktopCalendarSx: SxProps = {
    "& .MuiPickersCalendarHeader-root": {
        m: 0,
    },
    "& div": {
        maxHeight: 2000,
    },
    "& .MuiCalendarOrClockPicker-root > div, & .MuiCalendarOrClockPicker-root > div > div": {
        maxHeight: "2000px !important",
    },
    "& .MuiDayPicker-monthContainer": {
        position: "relative !important",
    },
    "& .MuiCalendarOrClockPicker-root > div": {
        width: "100%",
    },

    "& .MuiCalendarPicker-root": {
        width: "100%",
    },
    '& .PrivatePickersSlideTransition-root [role="row"]': {
        margin: 0,
    },
    "& .MuiPickersDay-dayWithMargin": {
        margin: 0,
        minHeight: "100%",
    },
    "& .Mui-selected:hover": {
        backgroundColor: "#8ea8ff",
    },
    "& .MuiDayPicker-weekDayLabel": {
        fontSize: "1rem",
        p: 0,
    },
};

interface DesktopCalendarProps extends CalendarViewProps {}

const DesktopCalendarView = observer((props: DesktopCalendarProps) => {
    const theme = useTheme();
    // размер ячейки календаря
    const [dateSize, setDateSize] = useState<number>((window.innerWidth - 300) / 7 - 5);
    useEffect(() => {
        const onWindowResize = () => {
            const newDs = (window.innerWidth - 300) / 7 - 5;
            setDateSize(Math.min(newDs, MaxDateSize));
        };
        onWindowResize();
        window.addEventListener("resize", onWindowResize);

        return () => {
            window.removeEventListener("resize", onWindowResize);
        };
    }, []);

    return (
        <>
            <Box
                sx={[
                    {
                        ...DesktopCalendarSx,
                        "& .MuiTypography-caption": {
                            width: dateSize,
                            margin: 0,
                        },
                        "& .PrivatePickersSlideTransition-root, & .MuiDayPicker-monthContainer": {
                            minHeight: BaseDateHeight * weekCount(props.currentYear, props.currentMonth),
                        },
                        "& .MuiPickersDay-root": {
                            width: dateSize,
                            minHeight: `${BaseDateHeight}px`,
                            height: "100%",
                            fontSize: "0.85rem",
                            border: "1px solid",
                            borderColor: theme.palette.primary.light,
                            borderRadius: 0,
                            alignItems: "flex-start",
                            background: "white",
                            color: theme.palette.getContrastText("#ffffff"),
                        },
                        "& .Mui-selected": {
                            backgroundColor: "#c8d5ff",
                            color: theme.palette.getContrastText(theme.palette.primary.light),
                        },
                    },
                ]}
            >
                <StaticDatePicker
                    {...BaseCalendarProps}
                    minDate={minDate}
                    maxDate={maxDate}
                    value={calendarStore.getChosenDate}
                    onChange={(v) => {
                        calendarStore.setChosenDate(dayjs(v).toDate());
                    }}
                    onMonthChange={(month) => {
                        props.setCurrentMonth(dayjs(month).toDate().getMonth());
                    }}
                    // @ts-ignore
                    onYearChange={props.setCurrentYear}
                    renderDay={DCDRenderer}
                    renderInput={() => <TextField />}
                />
            </Box>
        </>
    );
});

export default DesktopCalendarView;
