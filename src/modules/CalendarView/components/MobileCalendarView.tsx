/* eslint-disable react-hooks/exhaustive-deps */
import { Box, SxProps, TextField, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { weekCount } from "../../../utils/dateutils";
import { StaticDatePicker } from "@mui/x-date-pickers";

import { maxDate, minDate } from "./DesktopCalendarView";
import calendarStore from "../../../store/CalendarStore";
import { observer } from "mobx-react-lite";
import { CalendarViewProps } from "./interfaces";
import dayjs from "dayjs";
import BaseCalendarProps from "./BaseCalendarProps";
import MCDRenderer from "./MobileCustomDayRenderer";

const MaxDateSize = 140; // максимальный размер отображаемого на мобильном календаре дня
const MinHeightTableCell = 50; // минимальная высота яечйки

const MobileCalendarSx: SxProps = {
    width: "100%",
    "& div": {
        maxHeight: 5800,
        maxWidth: "100%",
    },
    "& .MuiCalendarOrClockPicker-root > div": {
        width: "100%",
    },
    "& .MuiCalendarPicker-root": {
        width: "100%",
    },

    "& > div": {
        minWidth: 256,
    },
    '& .PrivatePickersSlideTransition-root [role="row"]': {
        margin: 0,
    },
    "& .MuiPickersDay-dayWithMargin": {
        margin: 0,
        aspectRatio: "1/1",
        height: "100%",
        width: "100%",
    },
    "&: .MuiDialogActions-spacing": { px: 0 },
    "& .MuiDayPicker-weekDayLabel": {
        fontSize: "1rem",
        p: 0,
    },
};

interface MobileCalendarProps extends CalendarViewProps {}

const MobileCalendarView = observer((props: MobileCalendarProps) => {
    const theme = useTheme();

    // размер ячейки календаря
    const [dateSize, setDateSize] = useState<number>(44);

    useEffect(() => {
        const onWindowResize = () => {
            const newDs = window.innerWidth / 7 - 5;
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
                        ...MobileCalendarSx,
                        "& .MuiTypography-caption": {
                            width: dateSize,
                            margin: 0,
                        },
                        "& .PrivatePickersSlideTransition-root, & .MuiDayPicker-monthContainer": {
                            minHeight:
                                Math.max(dateSize, MinHeightTableCell) *
                                weekCount(props.currentYear, props.currentMonth),
                        },
                        "& .MuiPickersDay-root": {
                            width: dateSize,
                            height: dateSize,
                            fontSize: "1rem",

                            minHeight: `50px`,
                            border: "1px solid",
                            borderColor: theme.palette.grey.A400,
                            borderRadius: 1,
                            alignItems: "flex-start",
                            background: "white",
                            color: theme.palette.getContrastText("#ffffff"),
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
                    renderDay={MCDRenderer}
                    renderInput={() => <TextField />}
                />
            </Box>
        </>
    );
});

export default MobileCalendarView;
