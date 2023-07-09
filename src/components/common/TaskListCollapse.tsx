import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { TaskResponseItemSchema } from "../../api/schemas/responses/tasks";
import { compareTasks } from "../../utils/taskUtils";
import BaseTask from "../tasks/BaseTask";
import Box from "@mui/material/Box";
import { ViewModeEnum } from "../../enums/viewModEnum";
import { styled } from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

export const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} sx={{ borderRadius: 1, display: "flex", alignItems: "center", py: 0, px: 1 }} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
}));

interface TaskListCollapseProps {
    tasks: TaskResponseItemSchema[];
    title?: string;
    isCollapse?: boolean;
}

export default function TaskListCollapse(props: TaskListCollapseProps) {
    // раскрыть раздел с задачами
    const [expanded, setExpanded] = useState<boolean>(false);

    if (props.tasks.length === 0) return null;

    if (!props.isCollapse) {
        return (
            <>
                <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", whiteSpace: "nowrap", mt: 2 }}>
                    {props.title ? props.title : "Задачи"}
                </Typography>
                {props.tasks.sort(compareTasks).map((task) => (
                    <BaseTask key={task.id} task={task} viewMode={ViewModeEnum.PREVIEW} />
                ))}
            </>
        );
    }
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    mt: 1,
                    "&:hover": {
                        cursor: "pointer",
                    },
                    px: 0,
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Typography variant="subtitle1" component="h2" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    {props.title ? props.title : "Задачи"}
                </Typography>
                <ExpandMore expand={expanded}>
                    <ExpandMoreIcon />
                </ExpandMore>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                {props.tasks.sort(compareTasks).map((task) => (
                    <BaseTask key={task.id} task={task} viewMode={ViewModeEnum.PREVIEW} />
                ))}
            </Collapse>
        </>
    );
}
