export const notFound = "*";
export const loginPath: string = "/login";
export const registrationPath: string = "/signup";
export const forgotPasswordPath: string = "/forgot";
export const newPasswordPath: string = "/reset-psw";
export const successRegistrationPath: string = "/ready";

export const RelativeEditPath: string = "edit/";
export const RelativeCreatePath: string = "new";
/* ---------------------------------------------------- */

export const NotificationListPath: string = "/notifications";
export const FullViewNotificationPath: string = "/notifications/:id";

export function makeNotificationLinkById(id: number): string {
    return NotificationListPath + "/" + id.toString();
}

/* ---------------------------------------------------- */

export const UnitListPath: string = "/units";
export const FullViewUnitPath: string = "/units/:id";
export const EditUnitPath: string = `/units/:id/${RelativeEditPath}`;

export function makeUnitLinkById(id: number): string {
    return UnitListPath + "/" + id.toString();
}

/* ---------------------------------------------------- */

export const EventListPath: string = "/events";
export const FullViewEventPath: string = "/events/:id";
export const EditEventPath: string = `/events/:id/${RelativeEditPath}`;

export function makeEventLinkById(id: number): string {
    return EventListPath + "/" + id.toString();
}
/* ---------------------------------------------------- */

const BaseProcessPath: string = "/processes";

export const ProcessListPath: string = BaseProcessPath;
export const FullViewProcessPath: string = BaseProcessPath + "/:processId";
export const EditProcessPath: string = BaseProcessPath + `/:processId/${RelativeEditPath}`;

export function makeProcessLinkById(id: number): string {
    return BaseProcessPath + "/" + id.toString();
}

/* ---------------------------------------------------- */

export const RelativeTaskPath: string = "tasks/";
export const RelativeFullTaskPath: string = ":taskId/";

export function makeRelativeTaskLinkById(id: number): string {
    return `tasks/${id}`;
}

/* ---------------------------------------------------- */
export const CalendarPath: string = "/calendar/";

/* ---------------------------------------------------- */

export const RelativeEventPath: string = "events/";

export const FullViewEventRelativePath: string = ":id/";
export const EditEventCalendarPath: string = FullViewEventRelativePath + RelativeEditPath;

export function makeCalendarEventLinkById(id: number): string {
    return "events/" + id.toString();
}

/* ---------------------------------------------------- */

export const SettingsPath: string = "/settings";

/* ---------------------------------------------------- */
