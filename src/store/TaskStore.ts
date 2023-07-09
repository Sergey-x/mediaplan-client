import { TaskResponseItemSchema } from "../api/schemas/responses/tasks";
import { compareTasks } from "../utils/taskUtils";
import { autorun, makeAutoObservable } from "mobx";
import { API } from "../api/api";
import { FetchStatusEnum, FetchStatusStrings } from "../enums/fetchStatusEnum";
import calendarStore from "./CalendarStore";
import { isEqualYearMonthDate } from "../utils/dateutils";
import authUserStore from "./AuthUserStore";

class TaskStore {
    private tasks: TaskResponseItemSchema[] = [];
    private fetching: FetchStatusStrings = FetchStatusEnum.IDLE;

    constructor() {
        makeAutoObservable(this);
        autorun(() => {
            this.initStore();
        });
    }

    getById(id: number): TaskResponseItemSchema | undefined {
        const foundTask = this.tasks.find((task) => task.id === id);
        if (foundTask) return foundTask;
        if (id > 0) {
            this.fetchById(id);
        }
    }

    create(task: TaskResponseItemSchema): void {
        this.tasks.push(task);
    }

    update(taskId: number, taskData: TaskResponseItemSchema) {
        this.tasks = [...this.tasks.filter((task) => task.id !== taskId), taskData];
    }

    delete(taskId: number) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }

    updateMany(tasks: TaskResponseItemSchema[]) {
        if (tasks.length === 0) return;

        const updatedIds: number[] = tasks.map((task) => task.id);
        this.tasks = [...this.tasks.filter((task) => !updatedIds.includes(task.id)), ...tasks];
    }

    get getTasks(): TaskResponseItemSchema[] {
        return this.tasks;
    }

    getDayTasks(day: Date): TaskResponseItemSchema[] {
        return this.tasks.filter((task) => isEqualYearMonthDate(new Date(task.expirationTime), day));
    }

    getUnitTasks(id: number): TaskResponseItemSchema[] {
        return this.tasks.filter((task) => task.department?.id === id);
    }

    getProcessTasks(id: number): TaskResponseItemSchema[] {
        return this.tasks.filter((task) => task.process?.id === id).sort(compareTasks);
    }

    getEventTasks(id: number): TaskResponseItemSchema[] {
        return this.tasks.filter((task) => task.event?.id === id);
    }

    initStore(): void {
        console.log("Task store initialized");
    }

    fetchById = (id: number) => {
        API.tasks
            .getTaskById(id)
            .then((task: TaskResponseItemSchema) => {
                this.update(task.id, task);
            })
            .catch(() => {})
            .finally();
    };

    prefetchTasks = () => {
        // Пользователь не авторизован!
        if (!authUserStore.getMe) return;
        // Запрос уже в исполнении, не надо спамить на сервер - дождись завершения
        if (this.fetching === FetchStatusEnum.FETCHING) return;

        this.setFetchStatus(FetchStatusEnum.FETCHING);

        API.tasks
            .getTasks(calendarStore.getFiltersForTaskRequest)
            .then((tasks: TaskResponseItemSchema[]) => {
                this.setFetchStatus(FetchStatusEnum.SUCCESS);
                this.tasks = tasks.sort(compareTasks);
            })
            .catch(() => {
                this.setFetchStatus(FetchStatusEnum.ERROR);
            })
            .finally();
    };

    setFetchStatus(newStatus: FetchStatusStrings): void {
        this.fetching = newStatus;
    }
}

let taskStore = new TaskStore();
export default taskStore;
