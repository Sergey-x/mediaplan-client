import dayjs from "dayjs";

const relativeTime = require("dayjs/plugin/relativeTime");
require("dayjs/locale/ru");

dayjs.extend(relativeTime);
dayjs.locale("ru");

/**
 * Get count of days in month
 *
 * It works only for weeks starting on Monday.
 *
 * @param year - number of year
 * @param monthIndex - zero-based index [0-11]
 * */
export const daysInMonth = (year: number, monthIndex: number): number => {
    return new Date(year, monthIndex + 1, 0).getDate();
};

/**
 * Get count of weeks in month
 *
 * It works only for weeks starting on Monday.
 *
 * @param year - number of year
 * @param monthIndex - zero-based index [0-11]
 * */
export function weekCount(year: number, monthIndex: number): number {
    const firstWeekDayOfMonth: number = new Date(year, monthIndex, 1).getDay() || 7;
    const lastWeekDayOfMonth: number = new Date(year, monthIndex, daysInMonth(year, monthIndex)).getDay() || 7;
    const sum = 8 - firstWeekDayOfMonth + lastWeekDayOfMonth;

    if (sum <= 3) return 6;
    if (sum <= 10) return 5;
    return 4;
}

export function getTimeRepresentation(date: Date | undefined): string {
    if (!date) return "--:--";
    return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function getDateRepresentation(date: Date | undefined): string {
    if (!date) return "**-**-****";
    return date.toLocaleDateString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function getDatetimeRepresentation(date: Date | undefined): string {
    if (!date) return "**-**-****";
    return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function isEqualYearMonthDate(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export function compareDatetime(d1: Date, d2: Date): number {
    d1.setSeconds(0);
    d2.setSeconds(0);
    d1.setMilliseconds(0);
    d2.setMilliseconds(0);
    return d1.getTime() - d2.getTime();
}

const timezoneOffset: number = new Date().getTimezoneOffset() / 60;

export function getTimezoneDatetime(dd: Date): Date {
    const d: Date = new Date(dd);
    d.setHours(d.getHours() - timezoneOffset);
    d.setMilliseconds(0);
    d.setSeconds(0);
    return d;
}

export function getPastPeriod(dt: Date): string {
    // @ts-ignore
    return dayjs(dt).fromNow();
}

export function createDateAsUTC(date: Date) {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )
    );
}
