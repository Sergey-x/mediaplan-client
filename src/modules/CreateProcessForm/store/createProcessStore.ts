import { makeAutoObservable } from "mobx";
import { API } from "../../../api/api";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";
import { CreateProcessRequestSchema } from "../../../api/schemas/requests/processes";
import processStore from "../../Processes/store/ProcessStore";
import { createDateAsUTC } from "../../../utils/dateutils";

class CreateProcessStore {
    // открыта форма для создания или нет
    private isOpen: boolean = false;

    // состояние запроса на создание процесса ------------------------
    private requestStatus: FetchStatusStrings = FetchStatusEnum.IDLE;

    // данные нового процесса ---------------------------------------------
    private name: string = "";
    private description: string = "";
    private deadline: Date | undefined = undefined;
    // ------------------------------------------------------------------

    // id только что созданного процесса - нужен для загрузки файлов
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
        return this.getName.length > 0;
    }

    private getNewData(): CreateProcessRequestSchema {
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

    create(): Promise<ProcessResponseItemSchema | void> | undefined {
        if (!this.getIsDataValid) return;

        this.setRequestStatus(FetchStatusEnum.FETCHING);
        return API.process
            .create(this.getNewData())
            .then((process: ProcessResponseItemSchema) => {
                this.id = process.id;
                this.setRequestStatus(FetchStatusEnum.SUCCESS);
                processStore.add(process);
                this.resetData();
                return process;
            })
            .catch(() => {
                this.setRequestStatus(FetchStatusEnum.ERROR);
            });
    }
}

const createProcessStore = new CreateProcessStore();
export default createProcessStore;
