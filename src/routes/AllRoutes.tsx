import React from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route } from "react-router-dom";
import App from "../components/App";
import EditUnitForm from "../modules/Units/components/EditUnitForm";

import {
    CalendarPath,
    EditEventCalendarPath,
    EditEventPath,
    EditProcessPath,
    EditUnitPath,
    EventListPath,
    forgotPasswordPath,
    FullViewEventPath,
    FullViewEventRelativePath,
    FullViewNotificationPath,
    FullViewProcessPath,
    FullViewUnitPath,
    loginPath,
    newPasswordPath,
    notFound,
    NotificationListPath,
    ProcessListPath,
    registrationPath,
    RelativeEditPath,
    RelativeEventPath,
    RelativeFullTaskPath,
    RelativeTaskPath,
    SettingsPath,
    successRegistrationPath,
    UnitListPath,
} from "./paths";
import NewPasswordForm from "../modules/SettingsNewPasswordSection/components/NewPasswordForm";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SuccessSignUpMessagePage from "../pages/SuccessSignUpMessagePage";
import BaseEvent from "../components/events/BaseEvent";
import { FullNotificationView } from "../modules/Notifications";
import { observer } from "mobx-react-lite";
import { UserSchema } from "../api/schemas/responses/users";
import authUserStore from "../store/AuthUserStore";
import BaseUnit from "../modules/Units/components/BaseUnit";
import SettingsPage from "../pages/SettingsPage";
import CalendarPage from "../pages/CalendarPage";
import ErrorPage from "../pages/ErrorPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import ProcessesPage from "../pages/ProcessesPage";
import BaseProcess from "../modules/Processes/components/BaseProcess";
import EditTaskForm from "../components/tasks/EditTaskForm/EditTaskForm";
import { TaskModalView } from "../modules/ModalViews";
import BaseTask from "../components/tasks/BaseTask";
import { ViewModeEnum } from "../enums/viewModEnum";
import EventModalView from "../modules/ModalViews/components/EventModalView";
import EventPage from "../pages/EventPage";
import NotificationsPage from "../pages/NotificationsPage";
import UnitPage from "../pages/UnitPage";

/**
 * Обертка для приватных роутов, доступ к которым должен быть только о авторизованных пользователей.
 *
 * Проверяет наличие объекта user в `localStorage`, если объект есть, то пользователь считается авторизованным.
 * Если объекта нет, то происходит редирект на страницу логина.
 * */
const ProtectedLayout = observer(() => {
    const user: UserSchema | undefined = authUserStore.getMe;

    if (!user) {
        return <Navigate to={loginPath} />;
    }

    return <Outlet />;
});

/**
 * Обертка для публичных роутов, доступ к которым должен быть только у неавторизованных пользователей.
 *
 * Проверяет наличие объекта user в `localStorage`, если объект есть, то пользователь считается авторизованным.
 * Авторизованные пользователи редиректятся к данным (приватным роутам).
 * */
const PublicLayout = observer(() => {
    const user: UserSchema | undefined = authUserStore.getMe;

    if (user) {
        return <Navigate to={CalendarPath} />;
    }

    return <Outlet />;
});

/**
 * Обертка предоставляющая доступ к текущему авторизованному пользователю `user` и методам `login`/`logout`.
 * */
const AuthLayout = () => {
    return <Outlet />;
};

const TasksLayout = (
    <Route path={RelativeTaskPath} element={<TaskModalView />}>
        <Route path={RelativeFullTaskPath} element={<BaseTask viewMode={ViewModeEnum.FULL} />} />
        <Route path={`${RelativeFullTaskPath}${RelativeEditPath}`} element={<EditTaskForm />} />
    </Route>
);

const EventsLayout = (
    <Route path={RelativeEventPath} element={<EventModalView />}>
        <Route path={FullViewEventRelativePath} element={<BaseEvent viewMode={ViewModeEnum.FULL} />}>
            {TasksLayout}
        </Route>
        <Route path={EditEventCalendarPath} element={<BaseEvent viewMode={ViewModeEnum.EDIT} />} />
    </Route>
);

// Для использования нового api react-router-dom нужно определние с помощью `createRoutesFromElements`
export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<AuthLayout />}>
                <Route element={<PublicLayout />}>
                    <Route index element={<Navigate to={loginPath} replace={true} />} />

                    <Route path={loginPath} element={<SignInPage />} />
                    <Route path={forgotPasswordPath} element={<ForgotPasswordPage />} />
                    <Route path={newPasswordPath} element={<NewPasswordForm />} />

                    <Route path={registrationPath} element={<SignUpPage />} />
                    <Route path={successRegistrationPath} element={<SuccessSignUpMessagePage />} />

                    <Route path={notFound} element={<Navigate to={loginPath} replace={true} />} />
                </Route>

                <Route element={<ProtectedLayout />}>
                    <Route element={<App />} errorElement={<ErrorPage />}>
                        <Route index element={<Navigate to={CalendarPath} replace={true} />} />

                        {/* ==================== notifications routes ==================== */}
                        <Route path={NotificationListPath} element={<NotificationsPage />}>
                            <Route path={FullViewNotificationPath} element={<FullNotificationView />}>
                                {TasksLayout}
                            </Route>
                        </Route>

                        {/* ==================== units routes ==================== */}
                        <Route path={UnitListPath} element={<UnitPage />}>
                            <Route path={FullViewUnitPath} element={<BaseUnit viewMode={ViewModeEnum.FULL} />}>
                                {TasksLayout}
                            </Route>
                            <Route path={EditUnitPath} element={<EditUnitForm />} />
                        </Route>

                        {/* ==================== events routes ==================== */}
                        <Route path={EventListPath} element={<EventPage />}>
                            {TasksLayout}
                            <Route path={FullViewEventPath} element={<BaseEvent viewMode={ViewModeEnum.FULL} />}>
                                {TasksLayout}
                            </Route>
                            <Route path={EditEventPath} element={<BaseEvent viewMode={ViewModeEnum.EDIT} />} />
                        </Route>

                        {/* ==================== processes routes ==================== */}
                        <Route path={ProcessListPath} element={<ProcessesPage />}>
                            <Route path={FullViewProcessPath} element={<BaseProcess viewMode={ViewModeEnum.FULL} />}>
                                {TasksLayout}
                            </Route>
                            <Route path={EditProcessPath} element={<BaseProcess viewMode={ViewModeEnum.EDIT} />} />
                        </Route>

                        {/* ==================== settings routes ==================== */}
                        <Route path={SettingsPath} element={<SettingsPage />} />

                        {/* ==================== calendar routes ==================== */}
                        <Route path={CalendarPath} element={<CalendarPage />}>
                            {EventsLayout}
                            {TasksLayout}
                        </Route>
                    </Route>
                </Route>
            </Route>
        </>
    )
);
