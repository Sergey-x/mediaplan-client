import React, { ReactElement } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { SxProps } from "@mui/material";

const commonSX: SxProps = {
    minHeight: { xs: 0, md: "calc(100vh - 140px)" },
    maxHeight: { md: "calc(100vh - 140px)" },
    overflowY: "auto",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    p: 0,
};

const borderSX: SxProps = {
    borderWidth: "1px",
    borderColor: "#ababab",
    borderStyle: "solid",
    borderRadius: "5px",
};

interface LeftWrapperProps {
    children: any;
    sx?: SxProps;
}

const LeftWrapper = (props: LeftWrapperProps) => {
    return (
        <Box
            sx={{
                borderRight: "1px solid #ababab",
                minHeight: "100%",
                ...(props.sx ? props.sx : {}),
            }}
        >
            {props.children}
        </Box>
    );
};

export interface ListViewContainerProps {
    LeftBar: ReactElement;
    RightBar: ReactElement;
    TopBar: ReactElement;
}

export default function ListViewContainer(props: ListViewContainerProps) {
    const urlParams = useParams();
    const location = useLocation();
    const id: number = +(urlParams.id || urlParams.processId || 0);

    const createNewForm: boolean = location.pathname.endsWith("new");

    return (
        <>
            <Box sx={{ ...borderSX, p: 1, py: 0, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {props.TopBar}
                </Box>

                <Box sx={{ ...borderSX, py: 1 }}>
                    {Boolean(id > 0 || createNewForm) && (
                        <Grid container sx={{ justifyContent: "flex-start" }} spacing={0}>
                            <Grid
                                item
                                xs={0}
                                md={5}
                                lg={4}
                                xl={3}
                                sx={{
                                    ...commonSX,
                                }}
                            >
                                <LeftWrapper sx={{ display: { xs: "none", md: "block" } }}>{props.LeftBar}</LeftWrapper>
                            </Grid>
                            <Grid item xs={12} md={7} lg={8} xl={9}>
                                <Box sx={{ p: 1, width: "100%", height: "100%" }}>
                                    <Outlet />
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {id === 0 && (
                        <>
                            <Grid container sx={{ justifyContent: "flex-start", height: "100%" }} spacing={1}>
                                <Grid
                                    item
                                    xs={12}
                                    md={5}
                                    lg={4}
                                    xl={3}
                                    sx={{
                                        ...commonSX,
                                        display: { xs: createNewForm ? "none" : "block", md: "block" },
                                    }}
                                >
                                    <LeftWrapper>{props.LeftBar}</LeftWrapper>
                                </Grid>
                                <Grid item xs={0} md={7} lg={8} xl={9} sx={{ display: { xs: "none", md: "block" } }}>
                                    {props.RightBar}
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
}
