import { MEDIA_STATIC_SERVER } from "../../api/config";

export function makeAvatarPath(owner_id: number, filename: string | undefined): string {
    return [MEDIA_STATIC_SERVER, "USER", owner_id, filename || ""].join("/");
}
