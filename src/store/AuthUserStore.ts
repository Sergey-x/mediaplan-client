import { autorun, makeAutoObservable } from "mobx";
import { FetchStatusEnum, FetchStatusStrings } from "../enums/fetchStatusEnum";
import { API } from "../api/api";
import { UserSchema } from "../api/schemas/responses/users";

// Ключ данных текущего пользователя в localStorage
const AuthUserKey: string = "user";

class AuthUserStore {
    user: UserSchema | undefined = undefined;
    fetching: FetchStatusStrings = FetchStatusEnum.IDLE;

    constructor() {
        makeAutoObservable(this);
        autorun(() => {
            this.initStore();
        });
    }

    initStore(): void {
        console.log("Auth user store initialized");
    }

    delete() {
        window.localStorage.clear();
        this.user = undefined;
    }

    update(newUserData: UserSchema) {
        try {
            window.localStorage.setItem(AuthUserKey, JSON.stringify(newUserData));
        } catch (err) {}
        this.user = newUserData;
    }

    get getMe(): UserSchema | undefined {
        if (this.user) return this.user;
        const storageUserData: string = window.localStorage.getItem(AuthUserKey) || "";
        this.user = storageUserData ? JSON.parse(storageUserData) : undefined;
        return this.user;
    }

    setFetchStatus(newStatus: FetchStatusStrings): void {
        this.fetching = newStatus;
    }

    prefetchMe = () => {
        if (!this.getMe) return;
        // Запрос уже в исполнении, не надо спамить на сервер - дождись завершения
        if (this.fetching === FetchStatusEnum.FETCHING) return;

        this.setFetchStatus(FetchStatusEnum.FETCHING);

        API.users
            .getMe()
            .then((user: UserSchema) => {
                this.setFetchStatus(FetchStatusEnum.SUCCESS);
                this.update(user);
            })
            .catch(() => {
                if (!window.localStorage.getItem(AuthUserKey)) {
                    this.delete();
                }
                this.setFetchStatus(FetchStatusEnum.ERROR);
            })
            .finally();
    };
}

const authUserStore = new AuthUserStore();
export default authUserStore;
