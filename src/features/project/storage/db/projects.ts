import type {
    RecentProject,
} from "../../types/RecentProject";

import {
    put,
    get,
    getAll,
    remove,
} from "./indexedDb";

import {
    STORES,
} from "./database";

export function putRecentProject(
    project: RecentProject,
) {
    return put(
        STORES.recentProjects,
        project,
    );
}

export function getRecentProject(
    id: string,
) {
    return get<RecentProject>(
        STORES.recentProjects,
        id,
    );
}

export function getRecentProjects() {
    return getAll<RecentProject>(
        STORES.recentProjects,
    );
}

export function removeRecentProject(
    id: string,
) {
    return remove(
        STORES.recentProjects,
        id,
    );
}
