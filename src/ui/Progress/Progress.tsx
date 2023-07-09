import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

interface ProgressProps {
    size?: number | undefined;
}

export default function Progress(props: ProgressProps) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <CircularProgress size={props.size || 36} />
        </Box>
    );
}
