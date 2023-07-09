import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";

export function compareUnitById(a: UnitResponseItemSchema, b: UnitResponseItemSchema): number {
    return a.id - b.id;
}
