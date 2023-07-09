import { CalendarPath, makeCalendarEventLinkById, makeEventLinkById } from "../../../routes/paths";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import Link from "@mui/material/Link";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import { useLocation, useNavigate } from "react-router-dom";

interface EventLinkProps {
    event?: EventResponseItemSchema | undefined;
}

export default function EventLink(props: EventLinkProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const id: number = props.event?.id || 0;

    let navPath: string = makeEventLinkById(id);
    if (location.pathname.startsWith(CalendarPath)) {
        navPath = makeCalendarEventLinkById(id);
    }
    return (
        <>
            {props.event && (
                <Typography variant="body1" component="p" sx={{ display: "flex" }}>
                    <Link
                        href={navPath}
                        component="a"
                        variant="body2"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (id) {
                                navigate(navPath);
                            }
                        }}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        <IconButton sx={{ p: 0, pr: 1 }}>
                            <LocalActivityIcon sx={{ color: props.event.color || "" }} />
                        </IconButton>
                        <Typography sx={{ fontSize: "0.9rem" }} component="span">
                            {props.event.name}
                        </Typography>
                    </Link>
                </Typography>
            )}
        </>
    );
}
