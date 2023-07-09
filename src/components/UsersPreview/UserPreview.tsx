import { UserSchema } from "../../api/schemas/responses/users";
import MainAvatar from "../MainAvatar";
import { makeFullName } from "../../utils/userUtils";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";

interface UserPreviewProps {
    user: UserSchema;
    clickable?: boolean;
    userPost?: string;
}

export default function UserPreview(props: UserPreviewProps) {
    const theme = useTheme();

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    py: "4px",
                    cursor: props.clickable ? "pointer" : "auto",
                }}
            >
                <MainAvatar user={props.user} />
                <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontSize: "0.9rem" }}>
                        {makeFullName(props.user)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.8rem", color: theme.palette.grey.A700 }}>
                        {props.userPost}
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
