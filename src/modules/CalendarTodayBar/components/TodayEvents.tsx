import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import { observer } from "mobx-react-lite";
import Typography from "@mui/material/Typography";
import BaseEvent from "../../../components/events/BaseEvent";
import { ViewModeEnum } from "../../../enums/viewModEnum";
import React from "react";

interface TodayEventListProps {
    todayDateStr: string;
    dayEvents: EventResponseItemSchema[];
}

const TodayEventList = observer((props: TodayEventListProps) => {
    return (
        <>
            {props.dayEvents.length === 0 && (
                <Typography variant="subtitle1" component="p" className="text-center">
                    {props.todayDateStr}&nbsp;событий нет
                </Typography>
            )}

            {props.dayEvents.length > 0 && (
                <Typography variant="subtitle1" component="p" className="text-center">
                    События {props.todayDateStr}
                </Typography>
            )}

            {props.dayEvents.map((event) => (
                <div className="mb-2" key={event.id}>
                    <BaseEvent event={event} viewMode={ViewModeEnum.PREVIEW} />
                </div>
            ))}
        </>
    );
});

export default TodayEventList;
