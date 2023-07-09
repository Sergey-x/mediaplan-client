import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import WorkStatusPlate from "../../common/tasks_events/WorkStatusPlate";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import { observer } from "mobx-react-lite";
import { EventActionsProps, EventViewProps } from "./interfaces";
import theme from "../../../assets/theme";
import { getTimeRepresentation } from "../../../utils/dateutils";

interface DesktopCalendarEventPreviewProps extends EventViewProps, EventActionsProps {}

function DesktopCalendarEventPreview(props: DesktopCalendarEventPreviewProps) {
    const deadline: Date = new Date(props.event.endDate);

    return (
        <>
            <Tooltip
                title={
                    <Typography variant="body1" sx={{ fontSize: "15px" }}>
                        {props.event.name}
                    </Typography>
                }
            >
                <Box
                    sx={{
                        backgroundColor: "#e8e8e8",
                        color: theme.palette.getContrastText("#e8e8e8"),
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderRadius: "1px",
                        borderColor: "#d0d0d0",
                        flexGrow: 1,
                        px: "2px",
                        "&:hover": {
                            cursor: "pointer",
                            background: `linear-gradient(100deg, rgba(100,100,100,0.2) 5%, ${theme.palette.primary.main} 40%, rgba(100,100,100,0.2) 95%)`,
                            color: theme.palette.getContrastText(theme.palette.primary.main),
                        },
                    }}
                    onClick={props.navigateToFull}
                >
                    <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden", color: "inherit" }}>
                        <LocalActivityIcon color="primary" />
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "clip",
                                mx: "2px",
                            }}
                        >
                            {props.event.name}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            component="div"
                            sx={{
                                color: "black",
                                textShadow:
                                    "1px 0 #fff, -1px 0 #fff, 0 1px #fff, 0 -1px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff",
                                fontWeight: "bold",
                                fontSize: "0.85rem",
                                mr: "3px",
                            }}
                        >
                            {getTimeRepresentation(deadline)}
                        </Typography>
                        <WorkStatusPlate status={props.event.status} size="small" />
                    </Box>
                </Box>
            </Tooltip>
        </>
    );
}

export default observer(DesktopCalendarEventPreview);
