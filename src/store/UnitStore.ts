import { UnitResponseItemSchema } from "../api/schemas/responses/units";
import { FetchStatusEnum, FetchStatusStrings } from "../enums/fetchStatusEnum";
import { API } from "../api/api";
import { autorun, makeAutoObservable } from "mobx";
import authUserStore from "./AuthUserStore";
import { compareUnitById } from "../modules/Units/utils/unitUtils";

class UnitStore {
    private units: UnitResponseItemSchema[] = [];
    private fetching: FetchStatusStrings = FetchStatusEnum.IDLE;

    constructor() {
        makeAutoObservable(this);
        autorun(() => {
            this.initStore();
        });
    }

    getUnitNameById(id: number | undefined): string {
        return this.units.find((unit) => unit.id === id)?.name || "";
    }

    initStore(): void {
        console.log("Unit global store initialized");
    }

    get getAllUnits(): UnitResponseItemSchema[] {
        return this.units;
    }

    getById(id: number): UnitResponseItemSchema | undefined {
        return this.units.find((unit) => unit.id === id);
    }

    add(unit: UnitResponseItemSchema): void {
        this.units.push(unit);
        this.units.sort(compareUnitById);
    }

    update(unitId: number, unitData: UnitResponseItemSchema): void {
        this.units = [...this.units.filter((unit) => unit.id !== unitId), unitData];
        this.units.sort(compareUnitById);
    }

    delete(unitId: number): void {
        this.units = [...this.units.filter((unit) => unit.id !== unitId)];
    }

    prefetchData = () => {
        // Пользователь не авторизован!
        if (!authUserStore.getMe) return;
        // Запрос уже в исполнении, не надо спамить на сервер - дождись завершения
        if (this.fetching === FetchStatusEnum.FETCHING) return;

        this.setFetchStatus(FetchStatusEnum.FETCHING);

        API.units
            .all()
            .then((data: UnitResponseItemSchema[]) => {
                this.setFetchStatus(FetchStatusEnum.SUCCESS);
                this.units = data;
            })
            .catch(() => {
                this.setFetchStatus(FetchStatusEnum.ERROR);
            });
    };

    get getFetchStatus(): FetchStatusStrings {
        return this.fetching;
    }

    setFetchStatus(newStatus: FetchStatusStrings): void {
        this.fetching = newStatus;
    }
}

const unitStore = new UnitStore();
export default unitStore;
