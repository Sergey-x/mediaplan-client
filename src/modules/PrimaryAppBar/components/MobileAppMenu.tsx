import { Paper, useTheme } from "@mui/material";
import Divider from "@mui/material/Divider";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { UserSchema } from "../../../api/schemas/responses/users";
import authUserStore from "../../../store/AuthUserStore";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { lightBlue } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
    CalendarPath,
    EventListPath,
    NotificationListPath,
    ProcessListPath,
    SettingsPath,
    UnitListPath,
} from "../../../routes/paths";
import MainAvatar from "../../../components/MainAvatar";
import { makeFullName } from "../../../utils/userUtils";
import Badge from "@mui/material/Badge";
import { notificationStore } from "../../Notifications";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import TimelineIcon from "@mui/icons-material/Timeline";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

export const mobileMenuId = "primary-search-account-menu-mobile";

const MobileAppMenuDivider = () => {
    const theme = useTheme();

    return <Divider sx={{ my: "0 !important", background: theme.palette.grey[300] }} />;
};

interface MobileAppMenuItemProps {
    title: string;
    linkTo: string;
    icon: any;
    toggleDrawer: () => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

function MobileAppMenuItem(props: MobileAppMenuItemProps) {
    const navigate = useNavigate();

    const theme = useTheme();
    const contrastPrimaryTextColor: string = theme.palette.getContrastText(theme.palette.primary.main);

    return (
        <>
            <Link
                color={contrastPrimaryTextColor}
                href={props.linkTo}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(props.linkTo);
                    props.toggleDrawer()(e);
                }}
                sx={{
                    "&:hover": {
                        color: contrastPrimaryTextColor,
                    },
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    px: 2,
                    py: { xs: "10px" },
                }}
            >
                {props.icon}
                <Typography sx={{ ml: 1 }}>{props.title}</Typography>
            </Link>
        </>
    );
}

interface MobileAppMenuProps {
    open: boolean;
    toggleDrawer: () => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const MobileAppMenu = observer((props: MobileAppMenuProps) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const user: UserSchema | undefined = authUserStore.getMe;

    return (
        <SwipeableDrawer
            disableBackdropTransition
            anchor="left"
            open={props.open}
            onClose={props.toggleDrawer()}
            onOpen={props.toggleDrawer()}
        >
            <Paper
                elevation={0}
                sx={{
                    height: "100%",
                    borderRadius: 0,
                    background: lightBlue[900],
                    color: theme.palette.grey[300],
                }}
            >
                <Box
                    sx={{
                        minWidth: 300,
                    }}
                >
                    <Toolbar />
                    <Box sx={{ display: "flex", alignItems: "center", mx: 2, my: 1 }}>
                        <Link
                            href={SettingsPath}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(SettingsPath);
                                props.toggleDrawer()(e);
                            }}
                        >
                            <MainAvatar user={user} size={35} />
                        </Link>
                        <Typography variant="subtitle1" component="p" sx={{ py: 1, px: 2 }}>
                            {makeFullName(user)}
                        </Typography>
                    </Box>

                    <MobileAppMenuDivider />
                    <MobileAppMenuItem
                        title="Уведомления"
                        linkTo={NotificationListPath}
                        icon={
                            <Badge badgeContent={notificationStore.getUnread.length} color="error" variant="dot">
                                <NotificationsIcon />
                            </Badge>
                        }
                        toggleDrawer={props.toggleDrawer}
                    />
                    <MobileAppMenuDivider />
                    <MobileAppMenuItem
                        title="Календарь"
                        linkTo={CalendarPath}
                        icon={<CalendarMonthIcon />}
                        toggleDrawer={props.toggleDrawer}
                    />
                    <MobileAppMenuDivider />
                    <MobileAppMenuItem
                        title="События"
                        linkTo={EventListPath}
                        icon={<LocalActivityIcon />}
                        toggleDrawer={props.toggleDrawer}
                    />
                    <MobileAppMenuDivider />
                    <MobileAppMenuItem
                        title="Процессы"
                        linkTo={ProcessListPath}
                        icon={<TimelineIcon />}
                        toggleDrawer={props.toggleDrawer}
                    />
                    <MobileAppMenuDivider />
                    <MobileAppMenuItem
                        title="Отделы"
                        linkTo={UnitListPath}
                        icon={<PeopleIcon />}
                        toggleDrawer={props.toggleDrawer}
                    />
                    <MobileAppMenuDivider />
                    <MobileAppMenuItem
                        title="Настройки профиля"
                        linkTo={SettingsPath}
                        icon={<SettingsIcon />}
                        toggleDrawer={props.toggleDrawer}
                    />
                    <MobileAppMenuDivider />
                </Box>
            </Paper>
        </SwipeableDrawer>
    );
});

export default MobileAppMenu;
