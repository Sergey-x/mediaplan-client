import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

import { observer } from "mobx-react-lite";
import Link from "@mui/material/Link";
import { NotificationFilterEnum } from "../modules/Notifications/utils/enums";
import { notificationStore } from "../modules/Notifications";
import NotificationItem from "../modules/Notifications/components/NotificationItem";
import { NotificationListPath } from "../routes/paths";
import PlainSelector from "../components/selectors/PlainSelector";
import ListViewContainer from "../components/ListViewContainer/ListViewContainer";
import useScroll from "../hooks/useScroll";
import { FetchStatusEnum } from "../enums/fetchStatusEnum";
import Progress from "../ui/Progress";

const NotificationFilters: Array<[string, string]> = [
    [NotificationFilterEnum.ALL, "Все"],
    [NotificationFilterEnum.READ, "Прочитанные"],
    [NotificationFilterEnum.UNREAD, "Непрочитанные"],
];

const TopBar = observer(() => {
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        notificationStore.resetPageData();
        notificationStore.fetchData();
    }, [notificationStore.getFilterValue]);

    return (
        <Box sx={{ display: "flex", alignItems: "center", my: 0, py: 0 }}>
            <Typography
                component="h1"
                variant="h1"
                sx={{ fontSize: { xs: "1rem", md: "1.5rem" }, color: theme.palette.grey.A700, mb: 2, py: 1, my: 0 }}
            >
                <Link
                    href={NotificationListPath}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(NotificationListPath);
                    }}
                >
                    Уведомления
                </Link>
            </Typography>
            <PlainSelector
                filterValue={notificationStore.getFilterValue}
                setFilterValue={(val) => {
                    navigate(NotificationListPath);
                    notificationStore.setFilterValue(val);
                }}
                id="notifications-filter"
                filterObj={NotificationFilters}
            />
        </Box>
    );
});

const RightBar = () => {
    return (
        <Typography sx={{ textAlign: "center", mt: 3 }}>
            Выберите уведомление, чтобы увидеть подробную информацию
        </Typography>
    );
};

const NotificationList = observer(() => {
    // Идентификатор оповещения, если пользователь на него нажал
    const { id } = useParams();

    // Для пагинации
    const childRef: React.MutableRefObject<any> = useRef();

    useScroll(undefined, childRef, () => notificationStore.fetchData());

    return (
        <Box>
            {notificationStore.getPageNotifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    selected={id === notification.id.toString()}
                />
            ))}
            {notificationStore.getFetchStatus === FetchStatusEnum.FETCHING && <Progress />}

            <Box ref={childRef} sx={{ height: "10px" }}></Box>
        </Box>
    );
});

const NotificationsPage = () => {
    return (
        <>
            <ListViewContainer TopBar={<TopBar />} LeftBar={<NotificationList />} RightBar={<RightBar />} />
        </>
    );
};

export default NotificationsPage;
