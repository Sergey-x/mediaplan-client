import { useLocation, useParams } from "react-router-dom";
import React from "react";
import { observer } from "mobx-react-lite";
import ModalView from "./ModalView";
import CircularProgress from "@mui/material/CircularProgress";
import { RelativeCreatePath } from "../../../routes/paths";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import eventPageStore from "../../../components/events/store/eventPageStore";

function EventModalView() {
    const location = useLocation();
    const urlParams = useParams();

    const eventId = +(urlParams.id || 0);
    const task: EventResponseItemSchema | undefined = eventPageStore.getById(eventId);

    if (task === undefined) {
        return (
            <ModalView isOpen={true}>
                <CircularProgress color="primary" />
            </ModalView>
        );
    }

    return (
        <>
            <ModalView isOpen={eventId > 0 || location.pathname.endsWith(RelativeCreatePath)} />
        </>
    );
}

export default observer(EventModalView);
