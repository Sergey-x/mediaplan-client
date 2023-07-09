import React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import Link from "@mui/material/Link";
import { UnitListPath } from "../routes/paths";
import { createUnitStore } from "../modules/CreateUnitForm";
import CreateNewButton from "../ui/CreateNewButton";
import ListViewContainer from "../components/ListViewContainer/ListViewContainer";
import UnitList from "../modules/Units/components/UnitList";

const TopBar = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <>
            <Typography
                component="h1"
                variant="h1"
                sx={{ fontSize: { xs: "1rem", md: "1.5rem" }, color: theme.palette.grey.A700, mb: 2, py: 1, my: 0 }}
            >
                <Link
                    href={UnitListPath}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(UnitListPath);
                    }}
                >
                    Отделы департамента информационной политики СФУ
                </Link>
            </Typography>
            <CreateNewButton text="Новый отдел" onClick={() => createUnitStore.setIsOpen(true)} />
        </>
    );
};

const RightBar = () => {
    return (
        <Typography sx={{ textAlign: "center", mt: 3 }}>Выберите отдел, чтобы увидеть подробную информацию</Typography>
    );
};

const UnitPage = () => {
    return (
        <>
            <ListViewContainer LeftBar={<UnitList />} RightBar={<RightBar />} TopBar={<TopBar />} />
        </>
    );
};

export default UnitPage;
