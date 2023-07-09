import Link from "@mui/material/Link";
import { ProcessViewProps } from "./interfaces";
import { useNavigate } from "react-router-dom";
import { makeProcessLinkById } from "../../../routes/paths";
import { useTheme } from "@mui/material";
import { ProgressStatusEnum } from "../../../enums/progressEnum";
import WorkStatusPlate from "../../../components/common/tasks_events/WorkStatusPlate";
import Box from "@mui/material/Box";
import { getDatetimeRepresentation } from "../../../utils/dateutils";

interface ProcessPreviewProps extends ProcessViewProps {}

export default function ProcessPreview(props: ProcessPreviewProps) {
    const navigate = useNavigate();
    const theme = useTheme();

    const isInactive: boolean = props.process.status === ProgressStatusEnum.COMPLETED;
    const endDateLabel: string = props.process.endDate
        ? `(до: ${getDatetimeRepresentation(new Date(props.process.endDate))})`
        : "";

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "stretch" }}>
            <WorkStatusPlate status={props.process.status} />
            <Link
                href={makeProcessLinkById(props.process.id)}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(makeProcessLinkById(props.process.id));
                }}
                sx={{
                    flexGrow: 1,
                    py: "4px",
                    pl: "4px",
                    display: "block",
                    color: isInactive ? theme.palette.grey.A700 : "primary",
                    backgroundColor: props.isSelected ? "#e5e5e5" : "none",
                    "&:hover": {
                        backgroundColor: "#f5f8ff",
                    },
                }}
            >
                {props.process.name} {endDateLabel}
            </Link>
        </Box>
    );
}
