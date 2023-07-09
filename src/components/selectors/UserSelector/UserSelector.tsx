import { Autocomplete, TextField } from "@mui/material";
import UserPreview from "../../UsersPreview/UserPreview";
import { UserSchema } from "../../../api/schemas/responses/users";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import userStore from "../../../store/UserStore";
import { observer } from "mobx-react-lite";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import CircularProgress from "@mui/material/CircularProgress";
import unitStore from "../../../store/UnitStore";

interface UserSelectorProps {
    setInputValue: (users: UserSchema | null) => void;
    inputValue: UserSchema | null;
    className?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    disabledUserIds?: number[];
}

function UserSelector(props: UserSelectorProps) {
    const disabledUserIds = props.disabledUserIds || [];

    const [open, setOpen] = useState(false);
    const inputValue = props.inputValue || undefined;

    useEffect(() => {
        if (open) {
            userStore.prefetchData();
        }
    }, [open]);

    const users: UserSchema[] = userStore.getAllUsers;

    return (
        <>
            <div>
                <Autocomplete
                    id="user-selector"
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    loading={userStore.fetching === FetchStatusEnum.FETCHING}
                    disabled={props.disabled}
                    groupBy={(user: UserSchema) => unitStore.getUnitNameById(user.departmentId)}
                    options={users}
                    getOptionDisabled={(user: UserSchema) => {
                        return disabledUserIds.includes(user.id);
                    }}
                    fullWidth
                    freeSolo={true}
                    // @ts-ignore
                    getOptionLabel={(option: UserSchema) =>
                        [option.lastName, option.firstName, option.patronymic].join(" ")
                    }
                    renderOption={(props, option) => {
                        return (
                            <Box
                                component="li"
                                {...props}
                                key={option.id}
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    background: "#fff",
                                    "&:hover": {
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={inputValue?.id === option.id}
                                    className="mx-3 cursor-pointer"
                                />
                                <UserPreview user={option} />
                            </Box>
                        );
                    }}
                    value={props.inputValue}
                    onChange={(e, value) => {
                        props.setInputValue(value as any);
                    }}
                    renderInput={(params) => {
                        return (
                            <TextField
                                required
                                {...params}
                                label={props.label}
                                placeholder={props.placeholder}
                                inputProps={{
                                    ...params.inputProps,
                                    endAdornment: (
                                        <>
                                            {userStore.fetching === FetchStatusEnum.FETCHING ? (
                                                <CircularProgress color="primary" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        );
                    }}
                    className={props.className}
                />
            </div>
        </>
    );
}

export default observer(UserSelector);
