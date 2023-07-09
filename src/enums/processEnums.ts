export enum ProcessSortByEnum {
    NAME = "NAME",
    END_DATE = "END_DATE",
}

export type ProcessSortByStrings = (typeof ProcessSortByEnum)[keyof typeof ProcessSortByEnum];
