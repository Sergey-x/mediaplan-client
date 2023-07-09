const ENABLE_HTTPS: boolean = process.env.REACT_APP_ENABLE_HTTPS === "true";
const DOMAIN: string =
    process.env.NODE_ENV === "production" ? process.env.REACT_APP_MAIN_DOMAIN || "localhost" : "localhost";

console.log(process.env);
export const SERVER_ORIGIN: string = `http${ENABLE_HTTPS ? "s" : ""}://${DOMAIN}`;

export const MEDIA_STATIC_SERVER: string = `http${ENABLE_HTTPS ? "s" : ""}://${DOMAIN}/media`;

export const ACCESS_TOKEN_STORAGE_NAME = "access";
export const REFRESH_TOKEN_STORAGE_NAME = "refresh";
