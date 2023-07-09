import PaginatedList from "../../../utils/pagination";
import { EventResponseItemSchema, GetEventsResponseSchema } from "../../../api/schemas/responses/events";
import { API } from "../../../api/api";
import { PaginationQueryParamsSchema } from "../../../api/schemas/requests/common";
import { autorun, makeAutoObservable } from "mobx";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { StatusFilterEnum, StatusFilterStrings } from "../../../enums/common";
import { getAPIFilterStatus } from "../../../modules/Processes/store/ProcessStore";
import authUserStore from "../../../store/AuthUserStore";
import { isEqualYearMonthDate } from "../../../utils/dateutils";
import { FilterEventsParamsSchema } from "../../../api/schemas/requests/events";
import { getMonthDateRange } from "../../../api/utils/buildFilterParams";
import calendarStore from "../../../store/CalendarStore";
import { compareEventByDeadline } from "../utils/eventUtils";
import { ProgressStatusEnum } from "../../../enums/progressEnum";

class EventPageStore {
    // данные для фильтрации событий по статусу завершения на странице событий
    private filterStatus: StatusFilterStrings = StatusFilterEnum.InProgress;

    private paginatedEvents: PaginatedList<EventResponseItemSchema, GetEventsResponseSchema> = new PaginatedList(
        (params: PaginationQueryParamsSchema) => {
            return API.events.getMany({
                ...params,
                status: getAPIFilterStatus(this.getFilterStatus),
            });
        },
        (result: GetEventsResponseSchema): EventResponseItemSchema[] => {
            return result.events;
        }
    );

    private calendarFetchingStatus: FetchStatusStrings = FetchStatusEnum.IDLE;

    constructor() {
        makeAutoObservable(this);
        autorun(() => {
            this.initStore();
        });
    }

    initStore(): void {
        console.log("Event page store initialized");
    }

    get getCalendarFetchingStatus(): FetchStatusStrings {
        return this.calendarFetchingStatus;
    }

    setCalendarFetchingStatus(calendarFetchingStatus: FetchStatusStrings): void {
        this.calendarFetchingStatus = calendarFetchingStatus;
    }

    get getFilterStatus(): StatusFilterStrings {
        return this.filterStatus;
    }

    setFilterStatus(newStatus: StatusFilterStrings): void {
        this.filterStatus = newStatus;
    }

    resetPaginateStateStatus(): void {
        this.paginatedEvents.resetState();
    }

    get getEvents(): EventResponseItemSchema[] {
        // получить все имеющиеся объекты
        return this.paginatedEvents.getObjectList();
    }

    getById(eventId: number): EventResponseItemSchema | undefined {
        // получить один объект по id
        return this.paginatedEvents.getObjectList().find((event: EventResponseItemSchema) => event.id === eventId);
    }

    getDayEvents(day: Date): EventResponseItemSchema[] {
        // получить все объекты с днем истечения равным `day`

        return this.paginatedEvents
            .getObjectList()
            .filter((event) => isEqualYearMonthDate(new Date(event.endDate), day))
            .sort(compareEventByDeadline);
    }

    add(event: EventResponseItemSchema): void {
        this.update(event);
    }

    update(eventData: EventResponseItemSchema): void {
        const newObjectList: EventResponseItemSchema[] = [
            ...this.paginatedEvents.getObjectList().filter((event) => event.id !== eventData.id),
            eventData,
        ];
        newObjectList.sort(compareEventByDeadline);
        this.paginatedEvents.setObjectList(newObjectList);
    }

    delete(eventId: number): void {
        this.paginatedEvents.setObjectList(
            this.paginatedEvents.getObjectList().filter((event) => event.id !== eventId)
        );
    }

    fetchNextEventsPage() {
        // получить с сервера следующую страницу событий
        this.paginatedEvents.makeRequest()?.then();
    }

    fetchById(id: number): void {
        // получить с сервера одно событие по id
        if (!authUserStore.getMe) return;
        API.events.getById(id).then((data: EventResponseItemSchema) => {
            this.update(data);
        });
    }

    /*
     * Получить с сервера события для текущей страницы календаря
     * */
    fetchCalendarEvents = () => {
        // Пользователь не авторизован!
        if (!authUserStore.getMe) return;

        // Запрос уже в исполнении, не надо спамить на сервер - дождись завершения
        if (this.getCalendarFetchingStatus === FetchStatusEnum.FETCHING) return;

        const params: FilterEventsParamsSchema = getMonthDateRange(calendarStore.getViewedDate);

        if (calendarStore.getEventIds.size > 0) {
            params.events = Array.from(calendarStore.getEventIds);
        }

        if (calendarStore.getProgressStatus !== ProgressStatusEnum.ANY) {
            params.status = calendarStore.getProgressStatus;
        }
        params.pageNumber = 0;
        params.entitiesCount = 10000;

        API.events
            .getMany(params)
            .then((data: GetEventsResponseSchema) => {
                this.setCalendarFetchingStatus(FetchStatusEnum.SUCCESS);
                this.paginatedEvents.setObjectList(data.events);
            })
            .catch(() => {
                this.setCalendarFetchingStatus(FetchStatusEnum.ERROR);
            });
    };

    get getFetchStatus(): FetchStatusStrings {
        return this.paginatedEvents.getRequestStatus();
    }
}

let eventPageStore = new EventPageStore();
export default eventPageStore;
