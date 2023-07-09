import authUserStore from "../../../store/AuthUserStore";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function BackupEmailUserManager() {
    // почта авторизованного пользователя
    const email: string = authUserStore.getMe?.email || "";

    return (
        <>
            <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                Резервная почта
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="caption" sx={{ fontSize: "1rem", fontFamily: "monospace" }}>
                {email}
            </Typography>
        </>
    );
}
