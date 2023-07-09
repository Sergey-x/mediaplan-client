import { StaticDatePickerProps } from "@mui/x-date-pickers/StaticDatePicker/StaticDatePicker";

interface BaseCalendarPropsType extends Partial<StaticDatePickerProps<any, any>> {}

const BaseCalendarProps: BaseCalendarPropsType = {
    autoFocus: true,
    reduceAnimations: true,
    className: "w-100",
    showDaysOutsideCurrentMonth: true,
    openTo: "day",
    displayStaticWrapperAs: "desktop",

    componentsProps: {
        actionBar: {
            actions: ["today"],
        },
    },

    dayOfWeekFormatter: (day: string) => day.slice(0, 2),
};

export default BaseCalendarProps;
