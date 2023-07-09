import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import TaskListCollapse from "../../../components/common/TaskListCollapse";
import { UnitDescription, UnitParticipants, UnitTitle } from "./common";
import { getOnlyCompletedTasks, getOnlyOpenTasks } from "../../../utils/taskUtils";
import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { UnitActionsProps, UnitViewProps } from "./interfaces";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Outlet } from "react-router-dom";

interface FullUnitViewProps extends UnitViewProps, UnitActionsProps {}

const FullUnitView = observer((props: FullUnitViewProps) => {
    const unit: UnitResponseItemSchema = props.unit;

    const openTasks: TaskResponseItemSchema[] = getOnlyOpenTasks(props.tasks);
    const completedTasks: TaskResponseItemSchema[] = getOnlyCompletedTasks(props.tasks);

    return (
        <>
            <Card
                sx={{
                    minWidth: 280,
                    borderRadius: 0,
                    "& .MuiCardContent-root": {
                        padding: "12px !important",
                    },
                }}
                onClick={props.navigateToFull}
                elevation={0}
            >
                <CardContent>
                    <UnitTitle>{unit?.name}</UnitTitle>
                    <UnitDescription>{unit?.description}</UnitDescription>

                    <Typography component="p" variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Состав отдела
                    </Typography>
                    {unit?.admin && <UnitParticipants admin={unit.admin} members={props.unit.members} />}

                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        size="medium"
                        onClick={props.navigateToEdit}
                        sx={{ mt: 1 }}
                    >
                        Редактировать
                    </Button>

                    <TaskListCollapse
                        tasks={openTasks}
                        title={`Открытые задачи (${completedTasks.length}/${props.tasks.length})`}
                    />

                    <TaskListCollapse
                        tasks={completedTasks}
                        title={`Закрытые задачи (${completedTasks.length})`}
                        isCollapse
                    />
                </CardContent>
            </Card>
            <Outlet />
        </>
    );
});

export default FullUnitView;
