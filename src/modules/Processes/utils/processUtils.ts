import { ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";

export function compareProcessesByName(a: ProcessResponseItemSchema, b: ProcessResponseItemSchema): number {
    return Number(a.name > b.name);
}
