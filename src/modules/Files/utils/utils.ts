import { MEDIA_STATIC_SERVER } from "../../../api/config";
import { FileResponseItemSchema } from "../../../api/schemas/responses/files";
import { EventTypesStrings } from "../../../enums/filesEnums";

export function makeFileLink(file: FileResponseItemSchema, parentId: number, parentType: EventTypesStrings): string {
    return [MEDIA_STATIC_SERVER, parentType, parentId, file.filename].join("/");
}

export function fileSize(bytes: number): string {
    const kilobytes: number = bytes / 1024;
    const megabytes: number = kilobytes / 1024;

    if (megabytes > 1) {
        return Math.floor(megabytes * 10) / 10 + "MB";
    }
    return Math.floor(kilobytes * 10) / 10 + "KB";
}

export function compareFile(a: FileResponseItemSchema, b: FileResponseItemSchema): number {
    return b.id - a.id;
}
