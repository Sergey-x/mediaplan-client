import { UnitResponseItemSchema } from "./units";
import { EventResponseItemSchema } from "./events";
import { UserSchema } from "./users";
import { ProgressStatusStrings } from "../../../enums/progressEnum";
import { FileResponseItemSchema } from "./files";
import { ProcessResponseItemSchema } from "./processes";

export interface GetTasksResponseSchema {
    tasks: TaskResponseItemSchema[];
}

export interface TaskResponseItemSchema {
    id: number;
    name: string;
    description: string;
    taskStatus: ProgressStatusStrings;
    expirationTime: string;

    assignee: UserSchema[];
    author: UserSchema;

    department?: UnitResponseItemSchema;
    event?: EventResponseItemSchema;
    process?: ProcessResponseItemSchema;
    files?: FileResponseItemSchema[] | undefined | null;
}
