import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getDatetimeRepresentation, getPastPeriod } from "../../../utils/dateutils";
import Card from "@mui/material/Card";
import React, { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useApiCall from "../../../hooks/useApiCall";
import { API } from "../../../api/api";
import { NotificationsResponseItemSchema } from "../../../api/schemas/responses/notifications";
import { NotificationsStatusEnum } from "../utils/notificationsEnum";
import EventLink from "../../../components/links/EventLink/EventLink";
import TaskLink from "../../../components/links/TaskLink";
import { makeRelativeTaskLinkById } from "../../../routes/paths";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import notificationStore from "../store/NotificationStore";

export default function FullNotificationView() {
    const navigate = useNavigate();
    const { id } = useParams();

    const getNotificationApiCall = useApiCall<NotificationsResponseItemSchema | undefined>(
        () => API.notifications.getById(id || 0),
        undefined,
        [id]
    );
    const notification: NotificationsResponseItemSchema | undefined = getNotificationApiCall.data;
    const read: boolean = notification?.status === NotificationsStatusEnum.READ;

    const getTaskApiCall = useApiCall<TaskResponseItemSchema | undefined>(
        () => API.tasks.getTaskById(notification?.taskId || 0),
        undefined,
        [notification?.taskId],
        Boolean(notification?.taskId)
    );
    const getEventApiCall = useApiCall<EventResponseItemSchema | undefined>(
        () => API.events.getById(notification?.eventId || 0),
        undefined,
        [notification?.eventId],
        Boolean(notification?.eventId)
    );

    useEffect(() => {
        if (notification && notification.status === NotificationsStatusEnum.UNREAD) {
            API.notifications.changeNotificationStatus(notification.id, NotificationsStatusEnum.READ).then(() => {
                notificationStore.toggleNotificationStatus(notification);
            });
        }
    }, [notification]);

    if (!id || !notification) {
        return null;
    }

    return (
        <>
            <Card
                sx={{
                    backgroundColor: read ? "#f5f5f5" : "#e5efff",
                    borderRadius: 0,
                    borderBottom: "1px solid grey",
                }}
                elevation={0}
            >
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2">
                            {getDatetimeRepresentation(new Date(notification.creationTime))}&nbsp; (
                            {getPastPeriod(new Date(notification.creationTime))})
                        </Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: read ? "normal" : "bold" }}>
                        {notification.message}
                    </Typography>
                    {notification.taskId !== undefined && (
                        <>
                            {Boolean(getTaskApiCall.success && getTaskApiCall.data) && (
                                <TaskLink
                                    task={getTaskApiCall.data}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        navigate(makeRelativeTaskLinkById(getTaskApiCall.data?.id || 0));
                                    }}
                                />
                            )}
                        </>
                    )}
                    {notification.eventId && (
                        <>{getEventApiCall.success && <EventLink event={getEventApiCall.data} />}</>
                    )}
                </CardContent>
            </Card>
            <Outlet />
        </>
    );
}
