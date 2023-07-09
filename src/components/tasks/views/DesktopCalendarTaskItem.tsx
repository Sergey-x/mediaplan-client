import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useTheme } from "@mui/material/styles";
import WorkStatusPlate from "../../common/tasks_events/WorkStatusPlate";
import { getTimeRepresentation } from "../../../utils/dateutils";
import { TaskActionsProps, TaskViewProps } from "./interfaces";

interface DesktopCalendarTaskItemProps extends TaskViewProps, TaskActionsProps {}

export default function DesktopCalendarTaskItem(props: DesktopCalendarTaskItemProps) {
    const theme = useTheme();

    return (
        <>
            <Tooltip
                title={
                    <Typography variant="body1" sx={{ fontSize: "15px" }}>
                        {props.task.name}
                    </Typography>
                }
            >
                <Box
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                            background: `linear-gradient(100deg, rgba(100,100,100,0.2) 5%, ${theme.palette.primary.main} 40%, rgba(100,100,100,0.2) 95%)`,
                        },
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: `linear-gradient(100deg, ${props.task.department?.color} 20%, ${props.task.department?.color} 70%, rgba(100,100,100,0.1) 95%)`,
                        color: theme.palette.getContrastText(props.task.department?.color || "#ffffff"),
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "#e0e0e0",
                        borderRadius: 1,
                        flexGrow: 1,
                        px: "2px",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        props.navigateToFull(e);
                        return false;
                    }}
                >
                    <Typography
                        sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "clip",
                            mx: "5px",
                            color: "black",
                            textShadow:
                                "1px 0 #fff, -1px 0 #fff, 0 1px #fff, 0 -1px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff",
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            lineHeight: 1,
                        }}
                    >
                        {props.task.process && (
                            <TimelineIcon
                                sx={{
                                    color: "black",
                                    fontSize: "1.3rem",
                                    whiteSpace: "nowrap",
                                    mr: "5px",
                                    "& path": {
                                        filter: "drop-shadow(1px 1px 0 white) drop-shadow(-1px -1px 0 white)",
                                    },
                                }}
                            ></TimelineIcon>
                        )}
                        {props.task.name}
                    </Typography>

                    <Box sx={{ display: "flex" }}>
                        <Typography
                            component="div"
                            sx={{
                                color: "black",
                                textShadow:
                                    "1px 0 #fff, -1px 0 #fff, 0 1px #fff, 0 -1px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff",
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                                lineHeight: 1,
                                mt: "5px",
                                mr: "3px",
                            }}
                        >
                            {getTimeRepresentation(new Date(props.task.expirationTime))}
                        </Typography>
                        <WorkStatusPlate status={props.task.taskStatus} size="small" />
                    </Box>
                </Box>
            </Tooltip>
        </>
    );
}
