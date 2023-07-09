import { ProgressStatusEnum, ProgressStatusStrings } from "../../../enums/progressEnum";
import Box from "@mui/material/Box";
import DoneIcon from "@mui/icons-material/Done";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import { SvgIconPropsSizeOverrides } from "@mui/material/SvgIcon/SvgIcon";
import { OverridableStringUnion } from "@mui/types";

export interface WorkStatusPlateProps {
    status: ProgressStatusStrings;
    size?: OverridableStringUnion<"inherit" | "large" | "medium" | "small", SvgIconPropsSizeOverrides> | undefined;
}

export default function WorkStatusPlate(props: WorkStatusPlateProps) {
    return (
        <Box component="span">
            {props.status === ProgressStatusEnum.COMPLETED ? (
                <DoneIcon color="success" fontSize={props.size || "medium"} />
            ) : (
                <BuildCircleIcon color="info" fontSize={props.size || "medium"} />
            )}
        </Box>
    );
}
