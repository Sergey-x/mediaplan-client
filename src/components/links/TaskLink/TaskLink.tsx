import React from "react";
import { makeRelativeTaskLinkById } from "../../../routes/paths";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import TaskIcon from "@mui/icons-material/Task";
import { useNavigate } from "react-router-dom";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";

interface TaskLinkProps {
    task?: TaskResponseItemSchema | undefined;
    onClick?: (e: React.MouseEvent) => void;
}

export default function TaskLink(props: TaskLinkProps) {
    const navigate = useNavigate();

    const taskLink: string = props.task ? makeRelativeTaskLinkById(props.task.id) : "";

    const navigateToTask = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(taskLink);
    };

    return (
        <>
            {props.task && (
                <Typography variant="body1" component="p">
                    <Link
                        href={taskLink}
                        component="a"
                        variant="body2"
                        onClick={props.onClick || navigateToTask}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <TaskIcon sx={{ color: props.task.event?.color || "", mr: 1 }} />
                        <Typography component="span" sx={{ fontSize: "0.9rem" }}>
                            {props.task.name}
                        </Typography>
                    </Link>
                </Typography>
            )}
        </>
    );
}
