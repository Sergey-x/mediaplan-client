import { Autocomplete, TextField } from "@mui/material";
import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";
import { useEffect, useState } from "react";
import unitStore from "../../../store/UnitStore";
import { observer } from "mobx-react-lite";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import CircularProgress from "@mui/material/CircularProgress";

interface UnitSelectorProps {
    setInputValue: (unit: UnitResponseItemSchema) => void;
    inputValue: UnitResponseItemSchema | null;
    disabled?: boolean;
}

function UnitSelector(props: UnitSelectorProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            unitStore.prefetchData();
        }
    }, [open]);

    const units: UnitResponseItemSchema[] = unitStore.getAllUnits;

    return (
        <>
            <Autocomplete
                size="small"
                id="unit-selector"
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                loading={unitStore.getFetchStatus === FetchStatusEnum.FETCHING}
                disabled={props.disabled}
                autoHighlight
                fullWidth
                options={units}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    );
                }}
                getOptionLabel={(option: UnitResponseItemSchema) => option.name}
                value={props.inputValue}
                onChange={(e, value) => {
                    props.setInputValue(value as any);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Выберите отдел"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-unit", // disable autocomplete and autofill
                            endAdornment: (
                                <>
                                    {unitStore.getFetchStatus === FetchStatusEnum.FETCHING ? (
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

export default observer(UnitSelector);
