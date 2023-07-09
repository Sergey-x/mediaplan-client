import { makeAutoObservable } from "mobx";
import { API } from "../../../api/api";
import { FetchStatusEnum, FetchStatusStrings } from "../../../enums/fetchStatusEnum";
import { CreateUnitRequestSchema } from "../../../api/schemas/requests/units";
import { UserSchema } from "../../../api/schemas/responses/users";
import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";
import unitStore from "../../../store/UnitStore";
import { getRandomColor } from "../../../utils/colorUtils";

class CreateUnitStore {
    // открыта форма для создания или нет
    private isOpen: boolean = false;

    // состояние запроса на создание отдела ------------------------
    private requestStatus: FetchStatusStrings = FetchStatusEnum.IDLE;

    // данные нового отдела ---------------------------------------------
    private name: string = "";
    private description: string = "";
    private color: string = getRandomColor();
    private admin: UserSchema | undefined = undefined;
    private members: UserSchema[] = [];

    // ------------------------------------------------------------------

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

    get getColor(): string {
        return this.color;
    }

    setColor(color: string): void {
        this.color = color;
    }

    get getAdmin(): UserSchema | undefined {
        return this.admin;
    }

    setAdmin(admin: UserSchema | undefined): void {
        this.admin = admin;
    }

    get getMembers(): UserSchema[] {
        return this.members;
    }

    setMembers(members: UserSchema[]): void {
        this.members = members;
    }

    get getIsDataValid(): boolean {
        return this.getName.length > 0 && Boolean(this.admin);
    }

    private getNewData(): CreateUnitRequestSchema {
        return {
            name: this.getName,
            description: this.getDescription,
            color: this.color,
            adminId: this.admin?.id,
            members: this.members.map((user) => user.id),
        };
    }

    resetData(): void {
        this.setName("");
        this.setDescription("");
        this.setColor(getRandomColor());
        this.setAdmin(undefined);
        this.setMembers([]);
    }

    create(): Promise<UnitResponseItemSchema | void> | undefined {
        if (!this.getIsDataValid) return;

        this.setRequestStatus(FetchStatusEnum.FETCHING);
        return (
            API.units
                .createUnit(this.getNewData())
                // TODO: use UnitResponseItemSchema
                .then(() => {
                    this.setRequestStatus(FetchStatusEnum.SUCCESS);
                    unitStore.prefetchData();
                    this.resetData();
                    this.setIsOpen(false);
                })
                .catch(() => {
                    this.setRequestStatus(FetchStatusEnum.ERROR);
                })
        );
    }
}

const createUnitStore = new CreateUnitStore();
export default createUnitStore;
