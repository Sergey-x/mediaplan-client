import Typography from "@mui/material/Typography";

interface TaskDescriptionProps {
    children?: any;
}

export function TaskDescription(props: TaskDescriptionProps) {
    return (
        <>
            <Typography variant="body2" color="text.secondary">
                {props.children}
            </Typography>
        </>
    );
}
