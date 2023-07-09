import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Popper from "@mui/material/Popper";
import React from "react";

export interface ActionItem {
    title: string;
    clickHandler: () => void;
    icon: any;
}

export interface MoreActionMenuProps {
    actions: ActionItem[];
}

export default function MoreActionMenu(props: MoreActionMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement | undefined>(null);
    const open: boolean = Boolean(anchorEl);

    const handleClickCreateNewMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseCreateNewMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleClickCreateNewMenu}>
                <MoreVertIcon />
            </IconButton>
            <Popper
                id="basic-button"
                aria-controls={open ? "add-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                anchorEl={anchorEl || null}
                open={open}
                sx={{ zIndex: 9999 }}
            >
                <Paper>
                    <ClickAwayListener onClickAway={handleCloseCreateNewMenu}>
                        <MenuList sx={{ py: 0, textAlign: "left" }}>
                            {props.actions.map((actionItem: ActionItem) => (
                                <MenuItem
                                    key={actionItem.title}
                                    onClick={() => actionItem.clickHandler()}
                                    sx={{ px: 1, pr: 4 }}
                                >
                                    {actionItem.icon}
                                    <ListItemText>{actionItem.title}</ListItemText>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </>
    );
}
