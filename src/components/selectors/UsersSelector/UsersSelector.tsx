import { Autocomplete, TextField } from "@mui/material";
import UserPreview from "../../UsersPreview/UserPreview";
import { UserSchema } from "../../../api/schemas/responses/users";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import userStore from "../../../store/UserStore";
import { observer } from "mobx-react-lite";
import unitStore from "../../../store/UnitStore";

interface UsersSelectorProps {
    users?: UserSchema[];
    setInputValue: (users: UserSchema[]) => void;
    inputValue: UserSchema[];
    className?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    disabledUserIds?: number[];
}

function UsersSelector(props: UsersSelectorProps) {
    const disabledUserIds = props.disabledUserIds || [];

    useEffect(() => {
        if (!props.users) {
            userStore.prefetchData();
        }
    }, [props.users]);

    const users: UserSchema[] = props.users || userStore.getAllUsers;

    return (
        <>
            <div>
                <Autocomplete
                    size="small"
                    id="users-selector"
                    disabled={props.disabled}
                    multiple
                    groupBy={(user: UserSchema) => unitStore.getUnitNameById(user.departmentId)}
                    options={users}
                    getOptionDisabled={(user: UserSchema) => {
                        return disabledUserIds.includes(user.id);
                    }}
                    disableCloseOnSelect
                    fullWidth
                    freeSolo={true}
                    // @ts-ignore
                    getOptionLabel={(option: UserSchema) =>
                        [option.lastName, option.firstName, option.patronymic].join(" ")
                    }
                    renderOption={(props, option, { selected }) => (
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
                            <input type="checkbox" checked={selected} className="mx-3 cursor-pointer" />
                            <UserPreview user={option} />
                        </Box>
                    )}
                    value={props.inputValue}
                    onChange={(e, value) => {
                        props.setInputValue(value as any);
                    }}
                    renderInput={(params) => {
                        return <TextField {...params} label={props.label} placeholder={props.placeholder} />;
                    }}
                    className={props.className}
                />
            </div>
        </>
    );
}

export default observer(UsersSelector);
