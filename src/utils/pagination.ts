import { FetchStatusEnum, FetchStatusStrings } from "../enums/fetchStatusEnum";
import { action, makeObservable, observable } from "mobx";
import authUserStore from "../store/AuthUserStore";
import { PaginationQueryParamsSchema } from "../api/schemas/requests/common";
import { PaginationResponseSchema } from "../api/schemas/responses/common";

const DefaultPageSize: number = 30;

/*
 * Класс для управление пагинацией объектов.
 * */
class PaginatedList<TObject extends { id: number }, TResponse extends PaginationResponseSchema> {
    private maxPage: number;
    private currentPage: number;
    private pageSize: number;

    _objectList: TObject[];

    // запрос на получение страницы объектов
    private apiRequest: (params: PaginationQueryParamsSchema) => Promise<TResponse>;
    private getObjectsFromResponse: (response: TResponse) => TObject[];

    // статус выполнения запроса с пагинацией
    requestStatus: FetchStatusStrings;

    constructor(
        apiRequest: (params: PaginationQueryParamsSchema) => Promise<TResponse>,
        getObjectsFromResponse: (response: TResponse) => TObject[],
        pageSize: number = DefaultPageSize
    ) {
        makeObservable(this, {
            _objectList: observable,
            requestStatus: observable,
            makeRequest: action,
            resetState: action,
            setObjectList: action,
            setRequestStatus: action,
            setCurrentPage: action,
            setPageSize: action,
            setMaxPage: action,
        });

        this.currentPage = 0;
        this.maxPage = 0;
        this.pageSize = pageSize === 0 ? DefaultPageSize : pageSize;
        this._objectList = [];

        this.requestStatus = FetchStatusEnum.IDLE;

        this.apiRequest = apiRequest;
        this.getObjectsFromResponse = getObjectsFromResponse;
    }

    getObjectList(): TObject[] {
        return this._objectList;
    }

    setObjectList(newList: TObject[]): void {
        this._objectList = newList;
    }

    getCurrentPage(): number {
        return this.currentPage;
    }

    setCurrentPage(cp: number): void {
        this.currentPage = cp;
    }

    getPageSize(): number {
        return this.pageSize;
    }

    setPageSize(ps: number): void {
        this.pageSize = ps;
    }

    getMaxPage(): number {
        return this.maxPage;
    }

    setMaxPage(mp: number): void {
        this.maxPage = mp;
    }

    getRequestStatus(): FetchStatusStrings {
        return this.requestStatus;
    }

    setRequestStatus(rs: FetchStatusStrings): void {
        this.requestStatus = rs;
    }

    /*
     * Формируем query-params лдя запроса
     * */
    getPaginationParams(): PaginationQueryParamsSchema {
        return {
            pageNumber: this.currentPage,
            entitiesCount: this.pageSize,
        };
    }

    /*
     * Сбросить счетчики страниц, очистить список объектов.
     * */
    resetState(): void {
        this.requestStatus = FetchStatusEnum.IDLE;
        this.currentPage = 0;
        this.maxPage = 0;
        this._objectList = [];
    }

    makeRequest(): Promise<TResponse | void> | undefined {
        // если пользователь не авторизован, то запрос не выполняется
        if (authUserStore.getMe === undefined) return;

        // если запрос уже отправлен, то запрос не выполняется
        if (this.getRequestStatus() === FetchStatusEnum.FETCHING) return;
        // если предыдущий запрос завершился с ошибкой, то запрос не выполняется
        if (this.getRequestStatus() === FetchStatusEnum.ERROR) return;

        // если больше данных нет, то запрос не выполняется
        if (this.currentPage > this.maxPage) return;

        this.setRequestStatus(FetchStatusEnum.FETCHING);

        return this.apiRequest(this.getPaginationParams())
            .then((result: TResponse) => {
                this.setRequestStatus(FetchStatusEnum.SUCCESS);

                // общее кол-во страниц приходит с ответом
                this.setMaxPage(result.totalPagesCount - 1);

                // для следующего запроса - новая страница
                this.setCurrentPage(this.getCurrentPage() + 1);

                // пополняем список объектов, извлекая данные с помощтю переданного колбэка
                const newObjects: TObject[] = this.getObjectsFromResponse(result);

                //
                const newObjectIds: number[] = newObjects.map((obj) => obj.id);
                const newObjectList: TObject[] = [
                    ...this.getObjectList().filter((obj) => !newObjectIds.includes(obj.id)),
                    ...newObjects,
                ];
                this.setObjectList(newObjectList);
                //

                return result;
            })
            .catch((e) => {
                this.setRequestStatus(FetchStatusEnum.ERROR);
                console.log(e);
            });
    }
}

export default PaginatedList;
