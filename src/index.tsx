import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AllRoutes";
import { ThemeProvider } from "@mui/material";
import MainTheme from "./assets/theme";

import "bootstrap/dist/css/bootstrap.min.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={MainTheme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
