import * as React from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import { observer } from "mobx-react-lite";
import { UserSchema } from "../../../api/schemas/responses/users";
import authUserStore from "../../../store/AuthUserStore";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { CalendarPath, EventListPath, ProcessListPath, SettingsPath, UnitListPath } from "../../../routes/paths";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import TimelineIcon from "@mui/icons-material/Timeline";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import Badge from "@mui/material/Badge";
import { notificationStore, NotificationTray } from "../../Notifications";
import { makeFullName } from "../../../utils/userUtils";
import MainAvatar from "../../../components/MainAvatar";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreIcon from "@mui/icons-material/MoreVert";
import { mobileMenuId } from "./MobileAppMenu";

interface DesktopAppMenuItemProps {
    tooltipText: string;
    to: string;
    Icon: React.ReactElement;
}

function DesktopAppMenuItem(props: DesktopAppMenuItemProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const contrastPrimaryTextColor: string = theme.palette.getContrastText(theme.palette.primary.main);

    return (
        <Tooltip
            title={
                <Typography variant="body1" sx={{ fontSize: "15px" }}>
                    {props.tooltipText}
                </Typography>
            }
        >
            <Link
                href={props.to}
                color={contrastPrimaryTextColor}
                sx={{
                    "&:hover": {
                        color: contrastPrimaryTextColor,
                    },
                }}
                onClick={(e) => {
                    e.preventDefault();
                    navigate(props.to);
                }}
            >
                <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
                    {props.Icon}
                    {/*<SvgIcon component={props.Icon} />*/}
                </IconButton>
            </Link>
        </Tooltip>
    );
}

export interface DesktopAppMenuProps {
    toggleDrawer: () => (event: React.KeyboardEvent | React.MouseEvent) => void;
    handleLogout: (
        event: React.MouseEvent<HTMLElement>,
        handler?: (event: React.MouseEvent<HTMLElement>) => void
    ) => void;
    handleMobileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const DesktopAppMenu = observer((props: DesktopAppMenuProps) => {
    const navigate = useNavigate();

    const user: UserSchema | undefined = authUserStore.getMe;

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    <DesktopAppMenuItem tooltipText="Календарь" to={CalendarPath} Icon={<CalendarMonthIcon />} />
                    <DesktopAppMenuItem tooltipText="События" to={EventListPath} Icon={<LocalActivityIcon />} />
                    <DesktopAppMenuItem tooltipText="Процессы" to={ProcessListPath} Icon={<TimelineIcon />} />
                    <DesktopAppMenuItem tooltipText="Отделы" to={UnitListPath} Icon={<PeopleIcon />} />
                    <DesktopAppMenuItem tooltipText="Настройки профиля" to={SettingsPath} Icon={<SettingsIcon />} />
                </Box>

                <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={props.toggleDrawer()}>
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Badge badgeContent={notificationStore.getUnread.length} color="error" sx={{ left: "-20px" }}>
                    <NotificationTray notification={notificationStore.getUnread} />
                </Badge>

                <Box sx={{ display: { xs: "none", md: "flex", alignItems: "center" } }}>
                    <Typography color="inherit" sx={{ mx: 1 }}>
                        {makeFullName(user)}
                    </Typography>

                    <Link
                        href={SettingsPath}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(SettingsPath);
                        }}
                    >
                        <MainAvatar user={user} size={40} />
                    </Link>
                </Box>

                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    <IconButton size="large" aria-label="logout" color="inherit" onClick={props.handleLogout}>
                        <Badge color="error">
                            <LogoutIcon />
                        </Badge>
                    </IconButton>
                </Box>
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                    <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={props.handleMobileMenuOpen}
                        color="inherit"
                    >
                        <MoreIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
});

export default DesktopAppMenu;
