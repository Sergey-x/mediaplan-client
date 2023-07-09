/**
 * Схема создания нового отдела.
 * */
export interface CreateUnitRequestSchema {
    name: string;
    description?: string;
    adminId?: number;
    members?: Array<number>;
    color?: string;
}

/**
 * Схема изменения отдела.
 * */
export interface UpdateTeamRequestSchema {
    departmentId: number;
    name?: string;
    adminId?: number;
    color?: string;
    description?: string;
    newMembers?: number[];
    membersToKick?: number[];
}
