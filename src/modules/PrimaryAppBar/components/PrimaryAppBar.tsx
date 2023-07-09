import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { loginPath } from "../../../routes/paths";
import authUserStore from "../../../store/AuthUserStore";
import MobileAppMenu, { mobileMenuId } from "./MobileAppMenu";
import DesktopAppMenu from "./DesktopAppMenu";

interface MobileAppMenuRendererProps {
    mobileMoreAnchorEl: null | HTMLElement | undefined;
    handleMobileMenuClose: () => void;
    handleLogout: (
        event: React.MouseEvent<HTMLElement>,
        handler?: (event: React.MouseEvent<HTMLElement>) => void
    ) => void;
}

const MobileAppMenuRenderer = (props: MobileAppMenuRendererProps) => {
    return (
        <Menu
            anchorEl={props.mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(props.mobileMoreAnchorEl)}
            onClose={props.handleMobileMenuClose}
        >
            <MenuItem onClick={props.handleLogout}>
                <IconButton
                    size="large"
                    aria-label="logout menu item"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <LogoutIcon />
                </IconButton>
                <span>Выйти</span>
            </MenuItem>
        </Menu>
    );
};

function PrimaryAppBar() {
    const navigate = useNavigate();

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement | undefined>(null);

    // открыт sidebar или нет
    const [isMobileAppMenuOpen, setIsMobileAppMenuOpen] = React.useState<boolean>(false);

    const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }
        setIsMobileAppMenuOpen(!isMobileAppMenuOpen);
    };

    const handleLogout = (
        event: React.MouseEvent<HTMLElement>,
        handler?: (event: React.MouseEvent<HTMLElement>) => void
    ) => {
        if (handler) {
            handler(event);
        }
        authUserStore.delete();
        navigate(loginPath);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <MobileAppMenu toggleDrawer={toggleDrawer} open={isMobileAppMenuOpen} />
            <DesktopAppMenu
                toggleDrawer={toggleDrawer}
                handleMobileMenuOpen={handleMobileMenuOpen}
                handleLogout={handleLogout}
            />
            <MobileAppMenuRenderer
                mobileMoreAnchorEl={mobileMoreAnchorEl}
                handleLogout={handleLogout}
                handleMobileMenuClose={handleMobileMenuClose}
            />
        </Box>
    );
}

export default PrimaryAppBar;
