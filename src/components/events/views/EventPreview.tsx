import { makeEventLinkById } from "../../../routes/paths";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { Box, IconButton, Tooltip } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { EventColorLeft, EventDescription, EventName } from "../common";
import DeadlineAndStatus from "../../common/tasks_events/DeadlineAndStatus";
import React from "react";
import { ProgressStatusEnum } from "../../../enums/progressEnum";
import { EventActionsProps, EventViewProps } from "./interfaces";
import { observer } from "mobx-react-lite";
import theme from "../../../assets/theme";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

interface EventPreviewProps extends EventViewProps, EventActionsProps {
    selected?: boolean;
}

function EventPreview(props: EventPreviewProps) {
    const openTasks: number = 0;

    return (
        <Box sx={{ "&:hover": { cursor: "pointer", background: "#f4f9ff" } }} onClick={props.navigateToFull}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <DeadlineAndStatus
                    endDate={props.event.endDate.toString()}
                    status={props.event.status}
                    onChangeStatus={props.toggleEventStatus(props.event.status === ProgressStatusEnum.COMPLETED)}
                />
                <Tooltip
                    title={
                        <Typography variant="body1" sx={{ fontSize: "15px" }}>
                            Добавить задачу
                        </Typography>
                    }
                >
                    <IconButton
                        sx={{ ml: 2, p: 0, "&:hover": { color: theme.palette.primary.main } }}
                        onClick={props.navigateToCreateTaskForm}
                    >
                        <NoteAddIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {openTasks !== 0 && (
                <Tooltip title={`Открытых задач: ${openTasks} `}>
                    <IconButton>
                        <AssignmentIcon />
                        <Typography variant="subtitle2" color="text.secondary" component="span">
                            {"-"}
                        </Typography>
                    </IconButton>
                </Tooltip>
            )}

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "stretch" }}>
                <EventColorLeft color={props.event.color} />
                <Link href={makeEventLinkById(props.event.id)} onClick={props.navigateToFull}>
                    <EventName>{props.event.name}</EventName>
                </Link>
            </Box>

            <EventDescription>{props.event.description}</EventDescription>

            <Box>
                {!props.event.files && (
                    <>
                        <Tooltip
                            title={
                                <Typography variant="body1" sx={{ fontSize: "15px" }}>
                                    Файловый сервис временно не доступен
                                </Typography>
                            }
                        >
                            <BrokenImageIcon sx={{ color: theme.palette.error.main }}></BrokenImageIcon>
                        </Tooltip>
                    </>
                )}
                {props.event.files && Boolean(props.event.files.length) && (
                    <Typography component="p" variant="subtitle1" sx={{ color: "grey" }}>
                        Файлов: {props.event.files.length}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default observer(EventPreview);
