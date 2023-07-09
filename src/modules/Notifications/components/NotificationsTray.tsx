import React, { useEffect, useState } from "react";
import { NotificationsResponseItemSchema } from "../../../api/schemas/responses/notifications";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { NotificationListPath } from "../../../routes/paths";
import { useNavigate } from "react-router-dom";
import NotificationItem from "./NotificationItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import MenuList from "@mui/material/MenuList";
import { Tooltip, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import notificationStore from "../store/NotificationStore";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import CircularProgress from "@mui/material/CircularProgress";
import { observer } from "mobx-react-lite";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";

interface NotificationTrayProps {
    notification: NotificationsResponseItemSchema[];
}

const NotificationTray = observer((props: NotificationTrayProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | undefined | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const [notifications, setNotifications] = useState<NotificationsResponseItemSchema[]>(props.notification);

    useEffect(() => {
        setNotifications(props.notification);
    }, [props.notification]);

    const open = Boolean(anchorEl);

    return (
        <ClickAwayListener
            onClickAway={() => {
                setAnchorEl(null);
            }}
        >
            <Box>
                <IconButton
                    size="large"
                    aria-label="show new notifications"
                    color="inherit"
                    onClick={handleClick}
                    sx={{ p: "5px", py: 0 }}
                >
                    <NotificationsIcon />
                </IconButton>
                <Popper
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    anchorEl={anchorEl || null}
                    open={open}
                    sx={{ zIndex: 1999, top: "20px !important" }}
                    placement="bottom-end"
                >
                    <Paper>
                        <MenuList sx={{ minWidth: "300px", px: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-stretch",
                                    alignItems: "center",
                                    lineHeight: "1rem",
                                    pb: 1,
                                }}
                            >
                                <Typography
                                    sx={{ verticalAlign: "bottom", flexGrow: 1, textAlign: "center" }}
                                    align="justify"
                                >
                                    Уведомления
                                </Typography>
                                {notificationStore.getUnread.length > 0 && (
                                    <Box sx={{ mr: "4px" }}>
                                        {notificationStore.getFetchStatus !== FetchStatusEnum.FETCHING && (
                                            <Tooltip title="Пометить все прочитанным">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        notificationStore.makeAllNotificationsRead();
                                                    }}
                                                    color="primary"
                                                    aria-label="make-read-all-notifications"
                                                    sx={{
                                                        p: 0,
                                                        borderRadius: 1,
                                                        "&:hover": { backgroundColor: "#ccd5ff" },
                                                    }}
                                                >
                                                    <CheckCircleOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {notificationStore.getFetchStatus === FetchStatusEnum.FETCHING && (
                                            <CircularProgress size={24} />
                                        )}
                                    </Box>
                                )}
                            </Box>
                            <Box>
                                {notifications.slice(0, 4).map((notification) => (
                                    <NotificationItem key={notification.id} notification={notification} />
                                ))}
                                {notifications.length === 0 && (
                                    <Typography sx={{ textAlign: "center", my: 2, color: theme.palette.grey.A700 }}>
                                        Пусто
                                    </Typography>
                                )}
                                <Link
                                    href={NotificationListPath}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setAnchorEl(null);
                                        navigate(NotificationListPath);
                                    }}
                                >
                                    <Typography sx={{ textAlign: "center", mt: 2 }}>Посмотреть все</Typography>
                                </Link>
                            </Box>
                        </MenuList>
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
});

export default NotificationTray;
