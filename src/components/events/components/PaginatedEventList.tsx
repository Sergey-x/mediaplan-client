import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Progress from "../../../ui/Progress";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import { observer } from "mobx-react-lite";
import BaseEvent from "../BaseEvent";
import { ViewModeEnum } from "../../../enums/viewModEnum";
import useScroll from "../../../hooks/useScroll";
import eventPageStore from "../store/eventPageStore";
import Alert from "@mui/material/Alert";

const PaginatedEventList = observer(() => {
    const theme = useTheme();

    // Пагинация. С этим элементом пересекается viewport
    const childRef: React.MutableRefObject<any> = useRef();

    // Для получения следующих событий при прокрутке вниз
    useScroll(undefined, childRef, () => eventPageStore.fetchNextEventsPage());

    useEffect(() => {
        // Если в сторе уже есть какие-то данные, например, после перехода с календаря, их нужно сбросить
        eventPageStore.resetPaginateStateStatus();
    }, []);

    return (
        <Box>
            {eventPageStore.getEvents.map((event) => (
                <Box key={event.id}>
                    <BaseEvent event={event} key={event.id} viewMode={ViewModeEnum.PREVIEW} />
                    <Divider sx={{ m: 0, backgroundColor: theme.palette.grey.A700 }} />
                </Box>
            ))}
            {eventPageStore.getFetchStatus === FetchStatusEnum.FETCHING && <Progress size={24} />}
            {eventPageStore.getFetchStatus === FetchStatusEnum.ERROR && (
                <Alert severity="error" sx={{ width: "100%" }}>
                    Ошибка загрузки
                </Alert>
            )}
            <Box ref={childRef} sx={{ height: "10px" }}></Box>
        </Box>
    );
});

export default PaginatedEventList;
