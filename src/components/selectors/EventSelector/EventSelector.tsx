import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import { observer } from "mobx-react-lite";
import CircularProgress from "@mui/material/CircularProgress";
import eventPageStore from "../../events/store/eventPageStore";

interface EventSelectorProps {
    setInputValue: (event: EventResponseItemSchema) => void;
    inputValue: EventResponseItemSchema | null;
    disabled?: boolean;
}

function EventSelector(props: EventSelectorProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            eventPageStore.fetchNextEventsPage();
        }
    }, [open]);

    return (
        <>
            <Autocomplete
                size="small"
                id="event-selector"
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                loading={eventPageStore.getFetchStatus === FetchStatusEnum.FETCHING}
                disabled={Boolean(props.disabled)}
                autoHighlight
                fullWidth
                options={eventPageStore.getEvents}
                renderOption={(props, option: EventResponseItemSchema) => {
                    return (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    );
                }}
                getOptionLabel={(option: EventResponseItemSchema) => option.name}
                value={props.inputValue}
                onChange={(e, value) => {
                    props.setInputValue(value as any);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Выберите событие"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-event", // disable autocomplete and autofill
                            endAdornment: (
                                <>
                                    {eventPageStore.getFetchStatus === FetchStatusEnum.FETCHING ? (
                                        <CircularProgress color="primary" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
        </>
    );
}

export default observer(EventSelector);
