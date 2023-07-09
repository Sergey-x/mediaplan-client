import { ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";
import { ViewModeStrings } from "../../../enums/viewModEnum";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";

export interface ProcessViewProps {
    viewMode?: ViewModeStrings | undefined;
    isSelected?: boolean | undefined;
    process: ProcessResponseItemSchema;
    tasks?: TaskResponseItemSchema[];
}
