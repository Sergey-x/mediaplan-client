import React from "react";
import Box from "@mui/material/Box";
import WorkStatusPlate, { WorkStatusPlateProps } from "./WorkStatusPlate";
import DeadlinePlate, { DeadlinePlateProps } from "./DeadlinePlate";
import { ProgressStatusEnum } from "../../../enums/progressEnum";
import { useTheme } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface DeadlineAndStatusProps extends WorkStatusPlateProps, DeadlinePlateProps {
    onChangeStatus?: (e: React.MouseEvent) => void;
}

export default function DeadlineAndStatus(props: DeadlineAndStatusProps) {
    const theme = useTheme();

    const isCompleted: boolean = props.status === ProgressStatusEnum.COMPLETED;

    let deadlineTextColor = "inherit";
    if (isCompleted) {
        deadlineTextColor = theme.palette.success.main;
    } else if (!isCompleted && new Date() > new Date(props.endDate)) {
        deadlineTextColor = theme.palette.error.main;
    }

    return (
        <Tooltip
            title={
                <Typography variant="body1" sx={{ fontSize: "15px" }}>{`Изменить статус выполнения на: "${
                    isCompleted ? "В работе" : "Завершено"
                }"`}</Typography>
            }
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
                onClick={props.onChangeStatus}
            >
                <WorkStatusPlate status={props.status} />
                <DeadlinePlate
                    endDate={props.endDate}
                    color={deadlineTextColor}
                    sx={{
                        cursor: "pointer",
                        borderRadius: "3px",
                        px: 1,
                        "&:hover": {
                            backgroundColor: "#d2d7ff",
                        },
                    }}
                />
            </Box>
        </Tooltip>
    );
}
