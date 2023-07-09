import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API } from "../../api/api";
import { EventResponseItemSchema } from "../../api/schemas/responses/events";
import { CalendarPath, makeCalendarEventLinkById, makeEventLinkById, RelativeEditPath } from "../../routes/paths";
import { createTaskStore } from "../../modules/CreateTaskForm";
import { ProgressStatusEnum, ProgressStatusStrings } from "../../enums/progressEnum";
import { ViewModeStrings } from "../../enums/viewModEnum";
import { EditEventRequestSchema } from "../../api/schemas/requests/events";
import eventPageStore from "./store/eventPageStore";
import BaseEventView from "./views/BaseEventView";

interface BaseEventProps {
    event?: EventResponseItemSchema;
    viewMode?: ViewModeStrings;
}

function BaseEvent(props: BaseEventProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const urlParams = useParams();

    // id события
    const id: number = +(urlParams?.id || props.event?.id || 0);

    // Получить данные события, если данные не переданы в пропсе
    const event = props.event || eventPageStore.getById(id);

    useEffect(() => {
        if (event === undefined) {
            eventPageStore.fetchById(id);
        }
    }, [id, event]);

    const navigateToEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!event) return;

        if (location.pathname.startsWith(CalendarPath)) {
            navigate(RelativeEditPath);
        } else {
            navigate(RelativeEditPath);
        }
    };

    const navigateToFull = (e: React.MouseEvent | undefined) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!event) return;

        if (location.pathname.startsWith(CalendarPath)) {
            navigate(makeCalendarEventLinkById(event.id));
        } else {
            navigate(makeEventLinkById(event.id));
        }
    };

    const navigateToCreateTaskForm = (e: React.MouseEvent | undefined) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!event) return;

        createTaskStore.setEvent(event);
        createTaskStore.setIsOpen(true);
    };

    const onChangeEventStatus = (open: boolean) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!id || !event) return;

        const newStatus: ProgressStatusStrings = open ? ProgressStatusEnum.IN_PROGRESS : ProgressStatusEnum.COMPLETED;
        const newEventData: EditEventRequestSchema = { eventId: id, status: newStatus };

        API.events.editEvent(newEventData).then(() => {
            event.status = newStatus;
        });
    };

    if (!id || !event) return null;

    return (
        <>
            <BaseEventView
                event={event}
                navigateToCreateTaskForm={navigateToCreateTaskForm}
                navigateToEdit={navigateToEdit}
                navigateToFull={navigateToFull}
                toggleEventStatus={onChangeEventStatus}
                viewMode={props.viewMode}
            />
        </>
    );
}

export default observer(BaseEvent);
