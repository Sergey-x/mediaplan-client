import Button from "@mui/material/Button";
import React from "react";
import processStore from "../store/ProcessStore";
import { EditProcessRequestSchema } from "../../../api/schemas/requests/processes";
import { API } from "../../../api/api";
import { ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";
import { ProgressStatusEnum, ProgressStatusStrings } from "../../../enums/progressEnum";
import { observer } from "mobx-react-lite";

interface ToggleStatusButtonProps {
    processId: number;
}

const ToggleStatusButton = observer((props: ToggleStatusButtonProps) => {
    const process: ProcessResponseItemSchema | undefined = processStore.getById(props.processId);

    function changeStatusHandler(newStatus: ProgressStatusStrings) {
        if (!process) return;
        const newProcessData: EditProcessRequestSchema = {
            processId: props.processId,
            status: newStatus,
        };

        API.process.edit(newProcessData).then((updatedProcess: ProcessResponseItemSchema) => {
            processStore.update({ ...updatedProcess, files: process.files });
        });
    }

    if (!process) return null;
    if (process?.status === ProgressStatusEnum.IN_PROGRESS) {
        return (
            <>
                <Button
                    variant="contained"
                    onClick={() => {
                        changeStatusHandler(ProgressStatusEnum.COMPLETED);
                    }}
                >
                    Завершить процесс
                </Button>
            </>
        );
    }

    if (process?.status === ProgressStatusEnum.COMPLETED) {
        return (
            <>
                <Button
                    variant="outlined"
                    onClick={() => {
                        changeStatusHandler(ProgressStatusEnum.IN_PROGRESS);
                    }}
                >
                    Запустить процесс
                </Button>
            </>
        );
    }
    return null;
});

export default ToggleStatusButton;
