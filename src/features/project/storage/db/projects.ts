import type {
    RecentProject,
} from "../../types/RecentProject";

import {
    put,
    getAll,
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

export function getRecentProjects() {
    return getAll<RecentProject>(
        STORES.recentProjects,
    );
}