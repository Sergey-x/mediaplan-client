import { makeAutoObservable } from "mobx";
import { API } from "../../../api/api";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { CreateEventRequestSchema } from "../../../api/schemas/requests/events";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import eventPageStore from "../../../components/events/store/eventPageStore";
import { createDateAsUTC } from "../../../utils/dateutils";

class CreateEventStore {
    // открыта форма для создания или нет
    private isOpen: boolean = false;

    // состояние запроса на создание события ------------------------
    private requestStatus: FetchStatusStrings = FetchStatusEnum.IDLE;

    // данные нового события ---------------------------------------------
    private name: string = "";
    private description: string = "";
    private deadline: Date | undefined = undefined;
    // ------------------------------------------------------------------

    // id только что созданного события - нужен для загрузки файлов
    private id: number | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    get getIsOpen(): boolean {
        return this.isOpen;
    }

    setIsOpen(isOpen: boolean): void {
        if (!isOpen) {
            this.resetData();
        }
        this.isOpen = isOpen;
    }

    get getRequestStatus(): FetchStatusStrings {
        return this.requestStatus;
    }

    setRequestStatus(requestStatus: FetchStatusStrings): void {
        this.requestStatus = requestStatus;
    }

    get getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    get getDescription(): string {
        return this.description;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    get getDeadline(): Date | undefined {
        return this.deadline;
    }

    setDeadline(deadline: Date | undefined): void {
        this.deadline = deadline;
    }

    get getId(): number | undefined {
        return this.id;
    }

    get getIsDataValid(): boolean {
        return this.getName.length > 0 && this.getDeadline !== undefined;
    }

    private getNewData(): CreateEventRequestSchema {
        return {
            name: this.getName,
            description: this.getDescription,
            endDate: this.getDeadline ? createDateAsUTC(this.getDeadline) : undefined,
        };
    }

    resetData(): void {
        this.setName("");
        this.setDescription("");
        this.setDeadline(undefined);
    }

    cleanAfterLoading(): void {
        this.id = undefined;
        this.setRequestStatus(FetchStatusEnum.IDLE);
        this.setIsOpen(false);
    }

    create(): Promise<EventResponseItemSchema | void> | undefined {
        if (!this.getIsDataValid) return;

        this.setRequestStatus(FetchStatusEnum.FETCHING);
        return API.events
            .createEvent(this.getNewData())
            .then((event: EventResponseItemSchema) => {
                this.id = event.id;
                this.setRequestStatus(FetchStatusEnum.SUCCESS);
                eventPageStore.add(event);
                this.resetData();
                return event;
            })
            .catch(() => {
                this.setRequestStatus(FetchStatusEnum.ERROR);
            });
    }
}

const createEventStore = new CreateEventStore();
export default createEventStore;
