import React from "react";
import { MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";

interface PlainSelectorProps {
    id?: string;
    filterValue: any;
    setFilterValue: (value: any) => void;
    filterObj: Array<[string, string]>;
}

export default function PlainSelector(props: PlainSelectorProps) {
    return (
        <Box
            sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                },
                "& .MuiSelect-select": {
                    py: 0,
                },
            }}
        >
            <Select
                id={props.id || "filter"}
                value={props.filterValue}
                onChange={(e) => {
                    props.setFilterValue(e.target.value as any);
                }}
            >
                {props.filterObj.map((menuItem) => (
                    <MenuItem key={menuItem[0]} value={menuItem[0]}>
                        {menuItem[1]}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
}
