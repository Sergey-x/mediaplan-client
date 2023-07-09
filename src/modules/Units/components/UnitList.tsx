import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Progress from "../../../ui/Progress";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material";
import unitStore from "../../../store/UnitStore";
import { observer } from "mobx-react-lite";
import { FetchStatusEnum } from "../../../enums/fetchStatusEnum";
import BaseUnit from "./BaseUnit";
import { ViewModeEnum } from "../../../enums/viewModEnum";
import ErrorMsg from "../../../ui/ErrorMsg";

const UnitList = observer(() => {
    const theme = useTheme();
    const { id } = useParams();

    useEffect(() => {
        unitStore.prefetchData();
    }, []);

    return (
        <Box>
            {unitStore.getFetchStatus === FetchStatusEnum.FETCHING && <Progress />}
            <ErrorMsg errText="Ошибка загрузки" visible={unitStore.getFetchStatus === FetchStatusEnum.ERROR} />

            {unitStore.getFetchStatus !== FetchStatusEnum.FETCHING &&
                unitStore.getAllUnits.map((unit) => (
                    <Box key={unit.id}>
                        <BaseUnit
                            unit={unit}
                            viewMode={ViewModeEnum.PREVIEW}
                            selected={unit.id.toString() === (id || "0")}
                        />
                        <Divider sx={{ m: 0, backgroundColor: theme.palette.grey.A700 }} />
                    </Box>
                ))}
        </Box>
    );
});

export default UnitList;
