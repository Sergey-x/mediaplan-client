import React from "react";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";
import MainAvatar from "../../../components/MainAvatar";
import { UserSchema } from "../../../api/schemas/responses/users";
import UserPreview from "../../../components/UsersPreview/UserPreview";

interface UnitTitleProps {
    children: any;
}

export function UnitTitle(props: UnitTitleProps) {
    return (
        <>
            <Typography variant="overline" sx={{ fontSize: "0.9rem" }}>
                {props.children}
            </Typography>
        </>
    );
}

interface UnitDescriptionProps {
    children: any;
}

export function UnitDescription(props: UnitDescriptionProps) {
    return (
        <>
            <Typography variant="subtitle2"> {props.children}</Typography>
        </>
    );
}

interface UnitParticipantsProps {
    admin?: UserSchema;
    members: UserSchema[];
    shortPreview?: boolean;
}

export function UnitParticipants(props: UnitParticipantsProps) {
    const justCommonMembers: UserSchema[] = props.members.filter((user) => user.id !== props.admin?.id);

    if (props.shortPreview) {
        return (
            <AvatarGroup total={justCommonMembers.length + (props.admin ? 1 : 0)}>
                {props.admin && <MainAvatar user={props.admin} />}

                {justCommonMembers.map((member) => (
                    <MainAvatar user={member} />
                ))}
            </AvatarGroup>
        );
    }

    return (
        <>
            {props.admin && <UserPreview user={props.admin} userPost="Руководитель отдела" />}
            <Divider />
            {justCommonMembers.map((user) => (
                <UserPreview user={user} key={user.id} clickable={true} userPost="Специалист" />
            ))}
        </>
    );
}
