import { autorun, makeAutoObservable } from "mobx";
import { UserSchema } from "../../../api/schemas/responses/users";
import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";
import { EventResponseItemSchema } from "../../../api/schemas/responses/events";
import { ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";
import { CreateTaskRequestSchema } from "../../../api/schemas/requests/tasks";
import { API } from "../../../api/api";
import { TaskResponseItemSchema } from "../../../api/schemas/responses/tasks";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import taskStore from "../../../store/TaskStore";
import authUserStore from "../../../store/AuthUserStore";
import { createDateAsUTC } from "../../../utils/dateutils";

class CreateTaskStore {
    // открыта форма для создания или нет
    private isOpen: boolean = false;

    // состояние запроса на создание задачи ------------------------
    private requestStatus: FetchStatusStrings = FetchStatusEnum.IDLE;

    // данные новой задачи ---------------------------------------------
    private name: string = "";
    private description: string = "";
    private deadline: Date | undefined = undefined;
    private executors: UserSchema[] = [];

    private unit: UnitResponseItemSchema | undefined = undefined;
    private event: EventResponseItemSchema | undefined = undefined;
    private process: ProcessResponseItemSchema | undefined = undefined;
    // ------------------------------------------------------------------

    // задача приватная (для себя) ------------------------
    private isPrivate: boolean = false;

    // id только что созданной задачи - нужен для загрузки файлов
    private id: number | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
        autorun(() => {});
    }

    get getIsOpen(): boolean {
        return this.isOpen;
    }

    setIsOpen(isOpen: boolean): void {
        console.log("prev = ", this.isOpen, " new = ", isOpen);
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

    get getExecutors(): UserSchema[] {
        return this.executors;
    }

    setExecutors(executors: UserSchema[]): void {
        this.executors = executors;
    }

    get getUnit(): UnitResponseItemSchema | undefined {
        return this.unit;
    }

    setUnit(unit: UnitResponseItemSchema | undefined): void {
        this.unit = unit;
    }

    get getEvent(): EventResponseItemSchema | undefined {
        return this.event;
    }

    setEvent(event: EventResponseItemSchema | undefined): void {
        this.event = event;
    }

    get getProcess(): ProcessResponseItemSchema | undefined {
        return this.process;
    }

    setProcess(process: ProcessResponseItemSchema | undefined): void {
        this.process = process;
    }

    get getId(): number | undefined {
        return this.id;
    }

    setOnlyMeToExecutors(): void {
        this.setExecutors(authUserStore.getMe ? [authUserStore.getMe] : []);
    }

    get getIsPrivate(): boolean {
        return this.isPrivate;
    }

    setIsPrivate(isPrivate: boolean): void {
        if (isPrivate) {
            this.setUnit(undefined);
            this.setEvent(undefined);
            this.setProcess(undefined);
            this.setOnlyMeToExecutors();
        }
        this.isPrivate = isPrivate;
    }

    get getIsTaskDataValid(): boolean {
        return this.getName.length > 0 && this.getDeadline !== undefined;
    }

    private createNewTaskData(): CreateTaskRequestSchema {
        return {
            name: this.getName,
            description: this.getDescription,
            expirationTime: this.getDeadline ? createDateAsUTC(this.getDeadline) : undefined,
            assigneeIds: this.getExecutors.map((user: UserSchema) => user.id),
            departmentId: this.getUnit?.id,
            eventId: this.getEvent?.id,
            processId: this.getProcess?.id,
        };
    }

    resetData(): void {
        this.setIsPrivate(false);
        this.setName("");
        this.setDescription("");
        this.setDeadline(undefined);
        this.setExecutors([]);
        this.setUnit(undefined);
        this.setEvent(undefined);
        this.setProcess(undefined);
    }

    cleanAfterLoading(): void {
        this.id = undefined;
        this.setRequestStatus(FetchStatusEnum.IDLE);
        this.setIsOpen(false);
    }

    createTask(): Promise<TaskResponseItemSchema | void> | undefined {
        if (!this.getIsTaskDataValid) return;

        this.setRequestStatus(FetchStatusEnum.FETCHING);
        return API.tasks
            .createTask(this.createNewTaskData())
            .then((task: TaskResponseItemSchema) => {
                this.id = task.id;
                this.setRequestStatus(FetchStatusEnum.SUCCESS);
                taskStore.create(task);
                this.resetData();
                return task;
            })
            .catch(() => {
                this.setRequestStatus(FetchStatusEnum.ERROR);
            });
    }
}

const createTaskStore = new CreateTaskStore();
export default createTaskStore;
