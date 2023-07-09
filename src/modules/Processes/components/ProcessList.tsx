import Box from "@mui/material/Box";
import processStore from "../store/ProcessStore";
import { ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";
import BaseProcess from "./BaseProcess";
import { ViewModeEnum } from "../../../enums/viewModEnum";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import Progress from "../../../ui/Progress";
import useScroll from "../../../hooks/useScroll";
import Alert from "@mui/material/Alert";

const ProcessList = observer(() => {
    const urlParams = useParams();

    // Для пагинации
    const childRef: React.MutableRefObject<any> = useRef();

    useScroll(undefined, childRef, () => processStore.prefetchData());

    useEffect(() => {
        processStore.resetPaginateStateStatus();
        processStore.prefetchData();
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [processStore.getFilterStatus]);

    const selectedProcessId: number = +(urlParams.processId || 0);

    return (
        <>
            <Box sx={{ p: 1 }}>
                {processStore.getAll.map((process: ProcessResponseItemSchema) => (
                    <BaseProcess
                        key={process.id}
                        process={process}
                        viewMode={ViewModeEnum.PREVIEW}
                        isSelected={process.id === selectedProcessId}
                    />
                ))}
                {processStore.getFetchStatus === FetchStatusEnum.ERROR && (
                    <Alert severity="error" sx={{ width: "100%" }}>
                        Ошибка загрузки
                    </Alert>
                )}
                {processStore.getFetchStatus === FetchStatusEnum.FETCHING && <Progress />}

                <Box ref={childRef} sx={{ height: "10px" }}></Box>
            </Box>
        </>
    );
});

export default ProcessList;
