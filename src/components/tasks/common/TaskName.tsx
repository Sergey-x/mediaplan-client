import Typography from "@mui/material/Typography";

export interface TaskNameProps {
    name: string | undefined;
}

export default function TaskName(props: TaskNameProps) {
    return (
        <Typography variant="h6" component="div" sx={{ fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis"}}>
            {props.name}
        </Typography>
    );
}
