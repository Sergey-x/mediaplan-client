import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InputAdornment, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "dayjs/locale/ru";

interface DatetimeInputProps {
    datetime: Date | null;
    setDatetime: (datetime: Date | null) => void;
    required?: boolean | undefined;
}

export default function DatetimeInput(props: DatetimeInputProps) {
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
                <MobileDateTimePicker
                    ampm={false}
                    label={`Дата и время ${props.required ? "*" : ""}`}
                    openTo="day"
                    value={props.datetime}
                    onChange={(e) => (e ? props.setDatetime(new Date(e)) : null)}
                    renderInput={(params) => <TextField size="small" {...params} sx={{ minWidth: "200px" }} />}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment
                                sx={{ "&:hover": { cursor: "pointer" } }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    props.setDatetime(null);
                                }}
                                position="end"
                            >
                                <CloseIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </LocalizationProvider>
        </>
    );
}
