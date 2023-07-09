import { FilterTasksParamsSchema } from "../api/schemas/requests/tasks";
import { autorun, makeAutoObservable } from "mobx";
import { getMonthDateRange } from "../api/utils/buildFilterParams";
import { ProgressStatusEnum, ProgressStatusStrings } from "../enums/progressEnum";
import { CalendarElemTypeEnum, CalendarElemTypeStrings } from "../enums/common";

const CalendarFiltersShowProcessTasksStorageKey: string = "c-user-filters-show-process-task";
const CalendarFiltersElemsTypeStorageKey: string = "c-user-filters-elem-type";
const CalendarFiltersUnitIdsStorageKey: string = "c-user-filters-unit-ids";
const CalendarFiltersEventIdsStorageKey: string = "c-user-filters-event-ids";
const CalendarFiltersExecutorsIdsStorageKey: string = "c-user-filters-executors-ids";
const CalendarFiltersTaskStatusStorageKey: string = "c-user-filters-task-status";

type IdsType = Set<number>;

class CalendarStore {
    // выбранный день
    private chosenDate: Date = new Date();

    // пользовательские фильтры (задаются непосредственно в сайдбаре фильтрации) ------
    private showProcessTask: boolean = true;

    private elemsType: CalendarElemTypeStrings = CalendarElemTypeEnum.ALL;
    private progressStatus: ProgressStatusStrings = ProgressStatusEnum.ANY;

    private unitIds: IdsType = new Set();
    private eventIds: IdsType = new Set();
    private executorIds: IdsType = new Set();
    // --------------------------------------------------------------------------------

    // день из просматриваемого диапазона дат, меняется при "листании" календаря
    private viewedDate: Date = new Date();

    constructor() {
        makeAutoObservable(this);
        autorun(() => {
            this.initStore();
        });
    }

    get getShowProcessTask(): boolean {
        return this.showProcessTask;
    }

    setShowProcessTask(showProcessTask: boolean) {
        this.showProcessTask = showProcessTask;
    }

    get getElemsType(): CalendarElemTypeStrings {
        return this.elemsType;
    }

    setElemsType(elemsType: CalendarElemTypeStrings) {
        this.elemsType = elemsType;
    }

    get getUnitIds(): IdsType {
        return new Set(this.unitIds);
    }

    setUnitIds(unitIds: IdsType) {
        this.unitIds = unitIds;
    }

    get getEventIds(): IdsType {
        return new Set(this.eventIds);
    }

    setEventIds(eventIds: IdsType) {
        this.eventIds = eventIds;
    }

    get getExecutorsIds(): IdsType {
        return new Set(this.executorIds);
    }

    setExecutorsIds(executorIds: IdsType) {
        this.executorIds = executorIds;
    }

    get getProgressStatus(): ProgressStatusStrings {
        return this.progressStatus;
    }

    setProgressStatus(progressStatus: ProgressStatusStrings) {
        this.progressStatus = progressStatus;
    }

    get getViewedDate(): Date {
        return this.viewedDate;
    }

    setViewedDate(d: Date) {
        this.viewedDate = d;
    }

    get getChosenDate(): Date {
        return this.chosenDate;
    }

    setChosenDate(d: Date) {
        this.chosenDate = d;
    }

    initStore(): void {
        this.updateFilterFromLocalStorage();
        console.log("Calendar store initialized");
    }

    report(): void {
        console.log("START Calendar store report ---------------------------------------");
        console.log(this.getElemsType);
        console.log("END Calendar store report ---------------------------------------");
    }

    resetFilters() {
        // Сброс пользовательских фильтров
        this.elemsType = CalendarElemTypeEnum.ALL;
        this.progressStatus = ProgressStatusEnum.ANY;

        this.unitIds.clear();
        this.eventIds.clear();
        this.executorIds.clear();

        this.saveFilterInLocalStorage();
    }

    saveFilterInLocalStorage() {
        // Сохранить пользовательские фильтры (задаются непосредственно в сайдбаре фильтрации) в localStorage
        window.localStorage.setItem(CalendarFiltersShowProcessTasksStorageKey, JSON.stringify(this.getShowProcessTask));
        window.localStorage.setItem(CalendarFiltersElemsTypeStorageKey, JSON.stringify(this.getElemsType));
        window.localStorage.setItem(CalendarFiltersTaskStatusStorageKey, JSON.stringify(this.progressStatus));

        window.localStorage.setItem(CalendarFiltersUnitIdsStorageKey, JSON.stringify(this.unitIds));
        window.localStorage.setItem(CalendarFiltersEventIdsStorageKey, JSON.stringify(this.eventIds));
        window.localStorage.setItem(CalendarFiltersExecutorsIdsStorageKey, JSON.stringify(this.executorIds));
    }

    updateFilterFromLocalStorage() {
        // Установить пользовательские фильтры значениями из localStorage

        this.setShowProcessTask(
            JSON.parse(window.localStorage.getItem(CalendarFiltersShowProcessTasksStorageKey) || "true")
        );

        this.setElemsType(
            JSON.parse(
                window.localStorage.getItem(CalendarFiltersElemsTypeStorageKey) ||
                    JSON.stringify(CalendarElemTypeEnum.ALL)
            )
        );

        this.setProgressStatus(
            JSON.parse(
                window.localStorage.getItem(CalendarFiltersTaskStatusStorageKey) ||
                    JSON.stringify(ProgressStatusEnum.ANY)
            )
        );

        this.setUnitIds(JSON.parse(window.localStorage.getItem(CalendarFiltersUnitIdsStorageKey) || "[]"));
        this.setEventIds(JSON.parse(window.localStorage.getItem(CalendarFiltersEventIdsStorageKey) || "[]"));
        this.setExecutorsIds(JSON.parse(window.localStorage.getItem(CalendarFiltersExecutorsIdsStorageKey) || "[]"));
    }

    get getFiltersForTaskRequest(): FilterTasksParamsSchema {
        let filters: FilterTasksParamsSchema = getMonthDateRange(this.getViewedDate);

        if (this.getProgressStatus) {
            filters.status = this.getProgressStatus;
        }

        if (this.getEventIds.size > 0) {
            filters.events = Array.from(this.getEventIds);
        }
        if (this.getUnitIds.size > 0) {
            filters.departments = Array.from(this.getUnitIds);
        }
        if (this.getExecutorsIds.size > 0) {
            filters.assignee = Array.from(this.getExecutorsIds);
        }

        return filters;
    }
}

let calendarStore = new CalendarStore();
export default calendarStore;
