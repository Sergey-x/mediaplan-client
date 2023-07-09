import React from "react";
import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";

export interface UnitViewProps {
    unit: UnitResponseItemSchema;
    tasks: TaskResponseItemSchema[];
}

export interface UnitActionsProps {
    navigateToEdit: (e: React.MouseEvent) => void;
    navigateToFull: (e: React.MouseEvent | undefined) => void;
}
