import Box from "@mui/material/Box";
import React from "react";
import CreateNewButton from "./CreateNewButton";
import CalendarFilters from "../../CalendarFilters";

export default function CalendarMenu() {
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "center", mx: 2, mb: 2 }}>
                <CreateNewButton />
                <CalendarFilters />
            </Box>
        </>
    );
}
