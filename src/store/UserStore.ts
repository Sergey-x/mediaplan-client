import { FetchStatusEnum, FetchStatusStrings } from "../enums/fetchStatusEnum";
import { UserSchema } from "../api/schemas/responses/users";
import { autorun, makeAutoObservable } from "mobx";
import authUserStore from "./AuthUserStore";
import { API } from "../api/api";

// TODO: add users sorting
class UserStore {
    users: UserSchema[] = [];
    fetching: FetchStatusStrings = FetchStatusEnum.IDLE;

    constructor() {
        makeAutoObservable(this);
        autorun(() => {
            this.initStore();
        });
    }

    initStore(): void {
        console.log("Users global store initialized");
    }

    get getAllUsers(): UserSchema[] {
        return this.users;
    }

    getById(id: number): UserSchema | undefined {
        if (id < 1) {
            console.log("Wrong user id.");
            return undefined;
        }
        return this.users.find((user) => user.id === id);
    }

    getUnitUsers(unitId: number): UserSchema[] {
        if (unitId < 1) {
            console.log("Wrong unitId id.");
            return [];
        }
        return this.users.filter((user) => user.departmentId === unitId);
    }

    get getUnitedUserIds(): number[] {
        return this.users.filter((user) => Boolean(user.departmentId)).map((user) => user.id);
    }

    prefetchData = () => {
        // Пользователь не авторизован!
        if (!authUserStore.getMe) return;
        // Запрос уже в исполнении, не надо спамить на сервер - дождись завершения
        if (this.fetching === FetchStatusEnum.FETCHING) return;

        this.setFetchStatus(FetchStatusEnum.FETCHING);

        API.users
            .all()
            .then((data: UserSchema[]) => {
                this.setFetchStatus(FetchStatusEnum.SUCCESS);
                this.users = data;
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

const userStore = new UserStore();
export default userStore;
