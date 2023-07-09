import React from "react";
import { NotificationsResponseItemSchema } from "../../../api/schemas/responses/notifications";
import { NotificationsStatusEnum, NotificationsStatusStrings } from "../utils/notificationsEnum";
import { useNavigate } from "react-router-dom";
import { makeEventLinkById, makeNotificationLinkById, makeRelativeTaskLinkById } from "../../../routes/paths";
import { API } from "../../../api/api";
import { getDatetimeRepresentation, getPastPeriod } from "../../../utils/dateutils";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import TaskIcon from "@mui/icons-material/Task";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import notificationStore from "../store/NotificationStore";
import { observer } from "mobx-react-lite";

interface NotificationItemProps {
    notification: NotificationsResponseItemSchema;
    selected?: boolean;
}

const NotificationItem = observer((props: NotificationItemProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const notification = props.notification;
    const read: boolean = props.notification.status === NotificationsStatusEnum.READ;

    function navigateToFull() {
        navigate(makeNotificationLinkById(notification.id));
    }

    function handleChangeStatus() {
        const newStatus: NotificationsStatusStrings =
            notification.status === NotificationsStatusEnum.UNREAD
                ? NotificationsStatusEnum.READ
                : NotificationsStatusEnum.UNREAD;

        API.notifications.changeNotificationStatus(notification.id, newStatus).then(() => {
            notificationStore.toggleNotificationStatus(notification);
        });
    }

    return (
        <>
            <Card
                key={notification.id}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    cursor: "pointer",
                    borderRadius: 1,
                    border: "1px solid grey",
                    "&:hover": { cursor: "pointer", backgroundColor: "#f1f7ff" },
                    backgroundColor: props.selected ? theme.palette.divider : "none",
                    "& .MuiCardContent-root": {
                        padding: "12px !important",
                    },
                }}
                onClick={navigateToFull}
                elevation={0}
            >
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ ml: "auto" }}>
                            {getDatetimeRepresentation(new Date(notification.creationTime))}&nbsp; (
                            {getPastPeriod(new Date(notification.creationTime))})
                        </Typography>
                    </Box>

                    <Typography variant="inherit" sx={{ fontWeight: read ? "normal" : "bold", fontSize: "0.9rem" }}>
                        {notification.message}
                    </Typography>

                    <Box sx={{ display: "none", alignItems: "center" }}>
                        {notification.taskId !== undefined && (
                            <Tooltip title="Перейти к задаче">
                                <Link
                                    href={makeRelativeTaskLinkById(notification.eventId || 0)}
                                    component="a"
                                    variant="body2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (notification.taskId) {
                                            navigate(makeRelativeTaskLinkById(notification.taskId));
                                        }
                                    }}
                                    sx={{ mx: 1 }}
                                >
                                    <TaskIcon />
                                </Link>
                            </Tooltip>
                        )}
                        {notification.eventId && (
                            <Tooltip title="Перейти к событию">
                                <Link
                                    href={makeEventLinkById(notification.eventId || 0)}
                                    component="a"
                                    variant="body2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (notification.eventId) {
                                            navigate(makeEventLinkById(notification.eventId));
                                        }
                                    }}
                                    sx={{ mx: 1 }}
                                >
                                    <LocalActivityIcon color="primary" />
                                </Link>
                            </Tooltip>
                        )}
                    </Box>
                </CardContent>

                <ToggleNotificationStatusButton notification={notification} handleChangeStatus={handleChangeStatus} />
            </Card>
        </>
    );
});

export default NotificationItem;

interface ToggleNotificationStatusButtonProps {
    notification: NotificationsResponseItemSchema;
    handleChangeStatus: () => void;
}

function ToggleNotificationStatusButton(props: ToggleNotificationStatusButtonProps) {
    const notification: NotificationsResponseItemSchema = props.notification;

    const tooltipText: string =
        props.notification.status === NotificationsStatusEnum.UNREAD
            ? "Отметить прочитанным"
            : "Восстановить непрочитанным";

    return (
        <Tooltip title={tooltipText}>
            <IconButton
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.handleChangeStatus();
                }}
                color={props.notification.status === NotificationsStatusEnum.UNREAD ? "success" : "primary"}
                aria-label="make-read"
                sx={{
                    p: "4px",
                    borderLeft: "1px solid grey",
                    borderRadius: 0,
                    "&:hover": { backgroundColor: "#ccd5ff" },
                }}
            >
                {notification.status === NotificationsStatusEnum.UNREAD && <CheckCircleOutlineIcon />}
                {notification.status === NotificationsStatusEnum.READ && <SettingsBackupRestoreIcon />}
            </IconButton>
        </Tooltip>
    );
}
