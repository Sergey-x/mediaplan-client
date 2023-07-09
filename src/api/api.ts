import { AuthApi } from "./crud/authApi";
import { EventsApi } from "./crud/eventsApi";
import { FilesApi } from "./crud/filesApi";
import { NotificationsApi } from "./crud/notificationsApi";
import { users } from "./crud/users";
import { UnitsApi } from "./crud/unitsApi";
import { tasks } from "./crud/tasks";
import { AvatarsApi } from "./crud/avatarsApi";
import { CommentsApi } from "./crud/commentsApi";
import { ProcessApi } from "./crud/processApi";

/**
 * Класс-провайдер методов `api`.
 * */
export class API {
    static auth = AuthApi;
    static avatars = AvatarsApi;
    static events = EventsApi;
    static files = FilesApi;
    static notifications = NotificationsApi;
    static tasks = tasks;
    static comments = CommentsApi;
    static process = ProcessApi;
    static units = UnitsApi;
    static users = users;
}
