import { LocalizationProvider } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/ru";
import dayjs from "dayjs";

interface DateInputProps {
    value: Date | null;
    handleChange: (value: Date | null) => void;
}

export default function DateInput(props: DateInputProps) {
    function handleChangeDate(value: Date | null) {
        props.handleChange(dayjs(value).toDate());
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <DatePicker
                    label="Дата"
                    inputFormat="DD-MM-YYYY"
                    value={props.value}
                    onChange={handleChangeDate}
                    renderInput={(params) => <TextField size="small" {...params} sx={{ minWidth: "150px" }} />}
                />
            </LocalizationProvider>
        </>
    );
}
