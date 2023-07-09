import React from "react";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MenuList from "@mui/material/MenuList";
import Link from "@mui/material/Link";
import { createTaskStore } from "../../CreateTaskForm";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import TaskIcon from "@mui/icons-material/Task";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import TimelineIcon from "@mui/icons-material/Timeline";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { createEventStore } from "../../CreateEventForm";
import { createProcessStore } from "../../CreateProcessForm";

export default function CreateNewButton() {
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
            <Button
                fullWidth
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={handleClickCreateNewMenu}
                sx={{
                    mr: 2,
                    backgroundColor: "rgb(25,118,210)",
                    background: "linear-gradient(60deg, rgba(25,118,210,1) 5%, rgba(156,39,176,1) 80%)",
                }}
            >
                Создать
            </Button>
            <Popper
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                anchorEl={anchorEl || null}
                open={open}
            >
                <Paper>
                    <ClickAwayListener onClickAway={handleCloseCreateNewMenu}>
                        <MenuList sx={{ minWidth: "180px", py: 0 }}>
                            <Link
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    createTaskStore.setIsOpen(true);
                                }}
                                sx={{ textDecoration: "none" }}
                            >
                                <MenuItem>
                                    <ListItemIcon>
                                        <TaskIcon fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText>Задача</ListItemText>
                                </MenuItem>
                            </Link>
                            <Divider />
                            <Link
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    createEventStore.setIsOpen(true);
                                }}
                                color="secondary"
                                sx={{ textDecoration: "none" }}
                            >
                                <MenuItem>
                                    <ListItemIcon>
                                        <LocalActivityIcon fontSize="small" color="secondary" />
                                    </ListItemIcon>
                                    <ListItemText>Событие</ListItemText>
                                </MenuItem>
                            </Link>
                            <Divider />
                            <Link
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    createProcessStore.setIsOpen(true);
                                }}
                                sx={{ textDecoration: "none", color: "#ed6c02" }}
                            >
                                <MenuItem>
                                    <ListItemIcon>
                                        <TimelineIcon fontSize="small" color="warning" />
                                    </ListItemIcon>
                                    <ListItemText color="warning">Процесс</ListItemText>
                                </MenuItem>
                            </Link>
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </>
    );
}
