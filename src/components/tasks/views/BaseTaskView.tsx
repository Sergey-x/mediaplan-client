import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import React from "react";
import FullTaskView from "./FullTaskView";
import { TaskActionsProps, TaskViewProps } from "./interfaces";
import TaskPreview from "./TaskPreview";
import { ViewModeEnum, ViewModeStrings } from "../../../enums/viewModEnum";
import DesktopCalendarTaskItem from "./DesktopCalendarTaskItem";

export interface BaseTaskViewProps extends TaskViewProps, TaskActionsProps {
    viewMode?: ViewModeStrings | undefined;
}

export default function BaseTaskView(props: BaseTaskViewProps) {
    if (props.viewMode === ViewModeEnum.CALENDAR) {
        return <DesktopCalendarTaskItem {...props} />;
    }
    return (
        <>
            <Card
                variant="outlined"
                sx={{
                    minWidth: "275px",
                    "& .MuiCardContent-root": {
                        paddingBottom: "8px !important",
                    },
                }}
            >
                <CardContent sx={{ p: 1 }}>
                    {!props.viewMode || (props.viewMode === ViewModeEnum.PREVIEW && <TaskPreview {...props} />)}
                    {props.viewMode === ViewModeEnum.FULL && <FullTaskView {...props} />}
                </CardContent>
            </Card>
        </>
    );
}
