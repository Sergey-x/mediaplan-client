/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import CalendarView from "../modules/CalendarView";
import calendarStore from "../store/CalendarStore";
import unitStore from "../store/UnitStore";
import userStore from "../store/UserStore";
import taskStore from "../store/TaskStore";
import eventPageStore from "../components/events/store/eventPageStore";

function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState<number>(calendarStore.getViewedDate.getMonth());
    const [currentYear, setCurrentYear] = useState<number>(calendarStore.getViewedDate.getFullYear());

    useEffect(() => {
        calendarStore.setViewedDate(new Date(currentYear, currentMonth + 1, 0, 0, 0, 0));
    }, [currentMonth, currentYear]);

    useEffect(() => {
        unitStore.prefetchData();
        userStore.prefetchData();
    }, []);

    /*
     * Запросить задачи и события при перелистывании месяцев календаря
     * */
    useEffect(() => {
        taskStore.prefetchTasks();
        // TODO: 2 times
        eventPageStore.fetchCalendarEvents();
    }, [calendarStore.getViewedDate]);

    useEffect(() => {}, [
        calendarStore.getElemsType,
        calendarStore.getProgressStatus,
        calendarStore.getEventIds,
        calendarStore.getUnitIds,
        calendarStore.getExecutorsIds,
    ]);

    return (
        <>
            <CalendarView
                currentMonth={currentMonth}
                currentYear={currentYear}
                setCurrentMonth={setCurrentMonth}
                setCurrentYear={setCurrentYear}
            />

            <Outlet />
        </>
    );
}

export default observer(CalendarPage);
