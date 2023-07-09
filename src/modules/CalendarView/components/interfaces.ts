import { PickersDayProps } from "@mui/x-date-pickers";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";

export interface CalendarViewProps {
    currentMonth: number;
    setCurrentMonth: (value: number) => void;
    currentYear: number;
    setCurrentYear: (value: number) => void;
}

export interface CustomDayRendererProps {
    today: Date;
    selectedDays: Array<Date | null>;
    pickersDayProps: PickersDayProps<Date>;
    todayEvents: EventResponseItemSchema[];
    todayTasks: TaskResponseItemSchema[];
}
