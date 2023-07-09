import dayjs from "dayjs";
import { getTimezoneDatetime } from "../../utils/dateutils";
import { FilterDateRangeQueryParamsSchema } from "../schemas/requests/common";

export function getMonthDateRange(d: Date): FilterDateRangeQueryParamsSchema {
    // Добавление 3 дней к диапазону чтоб не париться с часовыми поясами
    const startMonth: Date = dayjs(d).startOf("month").subtract(6, "day").toDate();
    const endMonth: Date = dayjs(d).endOf("month").add(6, "day").toDate();
    return {
        from: getTimezoneDatetime(startMonth).toJSON(),
        to: getTimezoneDatetime(endMonth).toJSON(),
    };
}
