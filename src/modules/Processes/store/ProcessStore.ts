import { FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { API } from "../../../api/api";
import { autorun, extendObservable } from "mobx";
import { GetProcessesResponseSchema, ProcessResponseItemSchema } from "../../../api/schemas/responses/processes";
import { ProgressStatusEnum, ProgressStatusStrings } from "../../../enums/progressEnum";
import { StatusFilterEnum, StatusFilterStrings } from "../../../enums/common";
import PaginatedList from "../../../utils/pagination";
import { compareProcessesByName } from "../utils/processUtils";
import { ProcessSortByEnum } from "../../../enums/processEnums";
import { PaginationQueryParamsSchema } from "../../../api/schemas/requests/common";

export function getAPIFilterStatus(getFilterStatus: StatusFilterStrings): ProgressStatusStrings | undefined {
    if (+getFilterStatus === +StatusFilterEnum.InProgress) {
        return ProgressStatusEnum.IN_PROGRESS;
    } else if (+getFilterStatus === +StatusFilterEnum.Done) {
        return ProgressStatusEnum.COMPLETED;
    } else if (+getFilterStatus === +StatusFilterEnum.All) {
        return undefined;
    }
    return undefined;
}

class ProcessStore {
    // данные для фильтрации процессов по статусу завершения
    private filterStatus: StatusFilterStrings = StatusFilterEnum.InProgress;

    private paginatedProcesses: PaginatedList<ProcessResponseItemSchema, GetProcessesResponseSchema> =
        new PaginatedList(
            (params: PaginationQueryParamsSchema) => {
                return API.process.getMany({
                    ...params,
                    sortBy: ProcessSortByEnum.NAME,
                    status: getAPIFilterStatus(this.getFilterStatus),
                });
            },
            (result: GetProcessesResponseSchema): ProcessResponseItemSchema[] => {
                return result.processes;
            }
        );

    constructor() {
        extendObservable(this, {}, {}, { deep: true });
        autorun(() => {
            this.initStore();
        });
    }

    initStore(): void {
        console.log("Process page store initialized");
    }

    resetPaginateStateStatus(): void {
        this.paginatedProcesses.resetState();
    }

    get getFilterStatus(): StatusFilterStrings {
        return this.filterStatus;
    }

    setFilterStatus(newStatus: StatusFilterStrings): void {
        this.filterStatus = newStatus;
    }

    get getAll(): ProcessResponseItemSchema[] {
        return this.paginatedProcesses.getObjectList();
    }

    getById(id: number): ProcessResponseItemSchema | undefined {
        if (id === 0) {
            console.log("Wrong process id on getById.");
            return undefined;
        }
        return this.paginatedProcesses.getObjectList().find((process) => process.id === id);
    }

    add(newProcess: ProcessResponseItemSchema): void {
        let newObjectList = [
            ...this.paginatedProcesses.getObjectList().filter((process) => process.id !== newProcess.id),
            newProcess,
        ];
        newObjectList.sort(compareProcessesByName);
        this.paginatedProcesses.setObjectList(newObjectList);
    }

    update(processData: ProcessResponseItemSchema): void {
        this.add(processData);
    }

    delete(processId: number): void {
        this.paginatedProcesses.setObjectList(
            this.paginatedProcesses.getObjectList().filter((process) => process.id !== processId)
        );
    }

    prefetchData = () => {
        this.paginatedProcesses.makeRequest()?.then();
    };

    fetchProcessById(processId: number) {
        API.process.getById(processId).then((processData) => {
            this.update(processData);
        });
    }

    get getFetchStatus(): FetchStatusStrings {
        return this.paginatedProcesses.getRequestStatus();
    }
}

let processStore = new ProcessStore();
export default processStore;
