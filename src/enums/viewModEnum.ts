export enum ViewModeEnum {
    EDIT,
    FULL,
    CALENDAR,
    PREVIEW,
}

export type ViewModeStrings = (typeof ViewModeEnum)[keyof typeof ViewModeEnum];
