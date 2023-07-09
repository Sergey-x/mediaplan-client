import { UnitDescription, UnitParticipants, UnitTitle } from "./common";
import React from "react";
import { UnitActionsProps, UnitViewProps } from "./interfaces";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material";

interface UnitPreviewProps extends UnitViewProps, UnitActionsProps {
    selected?: boolean;
}

export default function UnitPreview(props: UnitPreviewProps) {
    const theme = useTheme();

    return (
        <>
            <Card
                sx={{
                    minWidth: 280,
                    borderRadius: 0,
                    backgroundColor: props.selected ? theme.palette.divider : "none",
                    "& .MuiCardContent-root": {
                        padding: "8px !important",
                    },
                    "&:hover": { cursor: "pointer", backgroundColor: "#f1f7ff" },
                }}
                onClick={props.navigateToFull}
                elevation={0}
            >
                <CardContent>
                    <UnitTitle>{props.unit.name}</UnitTitle>
                    <UnitDescription>{props.unit.description}</UnitDescription>
                    <UnitParticipants admin={props.unit.admin} members={props.unit.members} shortPreview />
                </CardContent>
            </Card>
        </>
    );
}
