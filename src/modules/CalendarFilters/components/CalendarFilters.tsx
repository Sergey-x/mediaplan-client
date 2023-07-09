import * as React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TuneIcon from "@mui/icons-material/Tune";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { IconButtonProps } from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import Toolbar from "@mui/material/Toolbar";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import { ProgressStatusEnum } from "../../../enums/progressEnum";
import { CalendarElemTypeEnum } from "../../../enums/common";
import { observer } from "mobx-react-lite";
import calendarStore from "../../../store/CalendarStore";
import { makeFullName } from "../../../utils/userUtils";
import unitStore from "../../../store/UnitStore";
import userStore from "../../../store/UserStore";
import taskStore from "../../../store/TaskStore";
import eventPageStore from "../../../components/events/store/eventPageStore";

function CalendarFilters() {
    // открыт sidebar или нет
    const [state, setState] = React.useState<boolean>(false);

    // Количество выбранных параметров каждого типа в фильтрах
    const selectedUnits: number = calendarStore.getUnitIds.size;
    const selectedUsers: number = calendarStore.getExecutorsIds.size;
    const selectedEvents: number = calendarStore.getEventIds.size;

    const activeFilters: number =
        selectedUnits ||
        selectedUsers ||
        selectedEvents ||
        +Boolean(calendarStore.getProgressStatus) ||
        +Boolean(calendarStore.getElemsType);

    function filterObjects(e: React.MouseEvent) {
        calendarStore.saveFilterInLocalStorage();
        taskStore.prefetchTasks();
        eventPageStore.fetchCalendarEvents();
        toggleDrawer(false)(e);
    }

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }
        setState(open);
    };

    function resetFilters(e: React.MouseEvent) {
        calendarStore.resetFilters();
        taskStore.prefetchTasks();
        eventPageStore.fetchCalendarEvents();
        toggleDrawer(false)(e);
    }

    const handleChangeRadioStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        calendarStore.setProgressStatus((event.target as HTMLInputElement).value as any);
    };

    const handleChangeRadioType = (event: React.ChangeEvent<HTMLInputElement>) => {
        calendarStore.setElemsType((event.target as HTMLInputElement).value as any);
    };

    return (
        <>
            <Badge variant="dot" color="info" badgeContent={activeFilters}>
                <IconButton onClick={toggleDrawer(true)} aria-label="reset" color="primary" sx={{ p: 0 }}>
                    <TuneIcon fontSize="large" sx={{ p: 0, m: 0 }} />
                </IconButton>
            </Badge>
            {state && (
                <SwipeableDrawer
                    disableBackdropTransition
                    anchor="right"
                    open={state}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <Box sx={{ minWidth: "280px", p: 2 }}>
                        <Toolbar />
                        <Typography variant="subtitle1" sx={{ fontSize: "1.2rem" }}>
                            Фильтры
                        </Typography>
                        <Divider />

                        {/*<FormGroup>*/}
                        {/*    <FormControlLabel*/}
                        {/*        control={*/}
                        {/*            <Checkbox*/}
                        {/*                checked={calendarStore.getShowProcessTask}*/}
                        {/*                onChange={(event) => calendarStore.setShowProcessTask(event.target.checked)}*/}
                        {/*            />*/}
                        {/*        }*/}
                        {/*        label="Показывать задачи процессов"*/}
                        {/*    />*/}
                        {/*</FormGroup>*/}

                        {/*<Divider />*/}

                        <FormControl sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" component="span" sx={{ fontWeight: "bold" }}>
                                Тип
                            </Typography>
                            <RadioGroup
                                defaultValue={""}
                                value={calendarStore.getElemsType}
                                onChange={handleChangeRadioType}
                                sx={{ "& .MuiRadio-root": { p: "5px" } }}
                            >
                                <FormControlLabel value={""} control={<Radio />} label="Любой" sx={{ m: 0 }} />
                                <FormControlLabel
                                    value={CalendarElemTypeEnum.TASK}
                                    control={<Radio />}
                                    label="Задачи"
                                    sx={{ m: 0 }}
                                />
                                <FormControlLabel
                                    value={CalendarElemTypeEnum.EVENT}
                                    control={<Radio />}
                                    label="События"
                                    sx={{ m: 0 }}
                                />
                            </RadioGroup>
                        </FormControl>

                        <Divider />
                        <FormControl>
                            <Typography variant="subtitle1" component="span" sx={{ fontWeight: "bold" }}>
                                Статус
                            </Typography>
                            <RadioGroup
                                defaultValue={""}
                                value={calendarStore.getProgressStatus}
                                onChange={handleChangeRadioStatus}
                                sx={{ "& .MuiRadio-root": { p: "5px" } }}
                            >
                                <FormControlLabel value={""} control={<Radio />} label="Любой" sx={{ m: 0 }} />
                                <FormControlLabel
                                    value={ProgressStatusEnum.COMPLETED}
                                    control={<Radio />}
                                    label="Завершено"
                                    sx={{ m: 0 }}
                                />
                                <FormControlLabel
                                    value={ProgressStatusEnum.IN_PROGRESS}
                                    control={<Radio />}
                                    label="В работе"
                                    sx={{ m: 0 }}
                                />
                            </RadioGroup>
                        </FormControl>

                        <Divider />
                        <FilterSection title="Отделы" selectedValueCount={selectedUnits} expanded>
                            {unitStore.getAllUnits.map((unit) => (
                                <FormGroup key={unit.id}>
                                    <FormControlLabel
                                        sx={{
                                            "& .MuiTypography-root": {
                                                color: unit.color || "black",
                                                fontWeight: "bold",
                                                fontSize: "0.9rem",
                                            },
                                        }}
                                        control={
                                            <Checkbox
                                                checked={calendarStore.getUnitIds.has(unit.id)}
                                                onChange={() => {
                                                    const ids = calendarStore.getUnitIds;
                                                    ids.has(unit.id) ? ids.delete(unit.id) : ids.add(unit.id);
                                                    calendarStore.setUnitIds(ids);
                                                }}
                                                sx={{
                                                    py: "4px",
                                                    color: unit.color || "black",
                                                    "&.Mui-checked": {
                                                        color: unit.color || "black",
                                                    },
                                                }}
                                            />
                                        }
                                        label={unit.name}
                                    />
                                </FormGroup>
                            ))}
                        </FilterSection>

                        <FilterSection title="События" selectedValueCount={selectedEvents}>
                            <Box
                                sx={{
                                    maxHeight: "200px",
                                    overflowY: "scroll",
                                }}
                            >
                                {eventPageStore.getEvents.map((event) => (
                                    <FormGroup
                                        key={event.id}
                                        sx={{
                                            color: event.status === ProgressStatusEnum.COMPLETED ? "grey" : "inherit",
                                        }}
                                    >
                                        <FormControlLabel
                                            sx={{
                                                color: event.status === ProgressStatusEnum.COMPLETED ? "grey" : "black",
                                            }}
                                            control={
                                                <Checkbox
                                                    checked={calendarStore.getEventIds.has(event.id)}
                                                    onChange={() => {
                                                        const ids = calendarStore.getEventIds;
                                                        ids.has(event.id) ? ids.delete(event.id) : ids.add(event.id);
                                                        calendarStore.setEventIds(ids);
                                                    }}
                                                    sx={{ py: "4px" }}
                                                />
                                            }
                                            label={event.name}
                                        />
                                    </FormGroup>
                                ))}
                            </Box>
                        </FilterSection>

                        <FilterSection title="Исполнители" selectedValueCount={selectedUsers}>
                            {userStore.getAllUsers.map((user) => (
                                <FormGroup key={user.id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={calendarStore.getExecutorsIds.has(user.id)}
                                                onChange={() => {
                                                    const ids = calendarStore.getExecutorsIds;
                                                    ids.has(user.id) ? ids.delete(user.id) : ids.add(user.id);
                                                    calendarStore.setExecutorsIds(ids);
                                                }}
                                                sx={{ py: "4px" }}
                                            />
                                        }
                                        label={makeFullName(user)}
                                    />
                                </FormGroup>
                            ))}
                        </FilterSection>

                        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={filterObjects}>
                            Применить
                        </Button>

                        <Button fullWidth variant="outlined" sx={{ mt: 3 }} onClick={resetFilters}>
                            Сбросить фильтры
                        </Button>
                    </Box>
                </SwipeableDrawer>
            )}
        </>
    );
}

export default observer(CalendarFilters);

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

interface FilterSectionProps {
    title: string;
    children?: any;
    selectedValueCount: number;
    expanded?: boolean | undefined;
}

function FilterSection(props: FilterSectionProps) {
    const [expanded, setExpanded] = React.useState<boolean>(props.expanded || false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Box sx={{ width: "100%", py: 1 }}>
                <Box onClick={handleExpandClick} sx={{ width: "100%", "&:hover": { cursor: "pointer" } }}>
                    <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                        <ExpandMoreIcon />
                    </ExpandMore>

                    <Typography variant="subtitle1" component="span" sx={{ fontWeight: "bold" }}>
                        <Badge
                            badgeContent={props.selectedValueCount}
                            color="primary"
                            sx={{
                                "& .MuiBadge-badge": {
                                    right: -15,
                                    top: 15,
                                },
                            }}
                        >
                            {props.title}
                        </Badge>
                    </Typography>
                </Box>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {props.children}
                </Collapse>
            </Box>
        </>
    );
}
