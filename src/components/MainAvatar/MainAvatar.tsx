import React from "react";
import { Avatar } from "@mui/material";
import { UserSchema } from "../../api/schemas/responses/users";
import Badge from "@mui/material/Badge";
import { makeFullName } from "../../utils/userUtils";
import { makeAvatarPath } from "./utils";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const baseAvatarSize: number = 48;

interface MainAvatarProps {
    user: UserSchema | undefined;
    size?: number;
}

export default function MainAvatar(props: MainAvatarProps) {
    /*
     * Компонент для аватара ползователя или команды (юнита, отдела).
     * */

    if (!props.user) return null;

    if (props.user?.isAdmin) {
        return (
            <>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={<StarRoundedIcon sx={{ color: "#FFD700" }} fontSize="small" />}
                >
                    <Avatar
                        alt={makeFullName(props.user)}
                        src={makeAvatarPath(props.user.id, props.user.avatar)}
                        sx={{ width: props.size || baseAvatarSize, height: props.size || baseAvatarSize }}
                    />
                </Badge>
            </>
        );
    }

    return (
        <>
            <Avatar
                alt={makeFullName(props.user)}
                src={makeAvatarPath(props.user.id, props.user.avatar)}
                sx={{ width: props.size || baseAvatarSize, height: props.size || baseAvatarSize }}
            />
        </>
    );
}
