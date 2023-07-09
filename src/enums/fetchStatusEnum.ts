export enum FetchStatusEnum {
    IDLE = "IDLE",
    FETCHING = "FETCHING",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
}

export type FetchStatusStrings = (typeof FetchStatusEnum)[keyof typeof FetchStatusEnum];
