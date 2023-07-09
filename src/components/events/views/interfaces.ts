import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import React from "react";
import { ViewModeStrings } from "../../../enums/viewModEnum";

export interface EventViewProps {
    event: EventResponseItemSchema;
    viewMode?: ViewModeStrings | undefined;
}

export interface EventActionsProps {
    navigateToEdit: (e: React.MouseEvent) => void;
    navigateToFull: (e: React.MouseEvent | undefined) => void;
    navigateToCreateTaskForm: (e: React.MouseEvent | undefined) => void;
    toggleEventStatus: (open: boolean) => (e: React.MouseEvent) => void;
}
