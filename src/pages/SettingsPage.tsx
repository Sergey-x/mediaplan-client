import UserAvatarManager from "../modules/UserAvatarManager";
import UserPersonalDataManager from "../modules/UserPersonalDataManager";
import BackupEmailUserManager from "../modules/BackupEmailUserManager";
import { NewPasswordForm } from "../modules/SettingsNewPasswordSection";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export default function SettingsPage() {
    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
                <Typography component="h1" variant="h5">
                    Пользовательские настройки
                </Typography>
                <UserAvatarManager />
                <UserPersonalDataManager />
                <BackupEmailUserManager />
                <NewPasswordForm />
            </Grid>
        </Grid>
    );
}
