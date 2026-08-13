import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    useProjectStore,
} from "../store/useProjectStore";

import {
    saveProject,
} from "../services/fileSystem/saveProject";

import {
    saveProjectAs,
} from "../services/fileSystem/saveProjectAs";

import {
    setActiveProject,
    getActiveProject,
} from "../storage/activeProject";

import {
    putRecentProject,
} from "../storage/db/projects";

import {
    notifyRecentProjectsUpdated,
} from "../services/recentProjectsEvents";

function getProjectName(
    name: string,
): string {
    return name.replace(
        /\.flow$/i,
        "",
    );
}

function getFileName(
    name: string,
): string {
    return name.endsWith(".flow")
        ? name
        : `${name}.flow`;
}

export async function saveProjectWorkflow() {
    const projectStore =
        useProjectStore.getState();

    const flowStore =
        useFlowStore.getState();

    const activeProject =
        getActiveProject();

    const handle =
        projectStore.fileHandle;

    if (!handle) {
        return saveProjectAsWorkflow();
    }

    const project =
        flowStore.saveProject(
            getProjectName(
                projectStore.name,
            ),
            activeProject
                ? {
                    id: activeProject.id,

                    createdAt:
                        activeProject.createdAt,
                }
                : undefined,
        );

    await saveProject(
        handle,
        project,
    );

    const fileName =
        getFileName(
            project.name,
        );

    setActiveProject(
        project,
    );

    await putRecentProject({
        id: project.id,

        name: project.name,

        fileName,

        lastOpened:
            new Date().toISOString(),

        handle,
    });

    notifyRecentProjectsUpdated();

    projectStore.markSaved();

    return true;
}

export async function saveProjectAsWorkflow() {
    const projectStore =
        useProjectStore.getState();

    const flowStore =
        useFlowStore.getState();

    const activeProject =
        getActiveProject();

    const project =
        flowStore.saveProject(
            getProjectName(
                projectStore.name,
            ),
            activeProject
                ? {
                    id: activeProject.id,

                    createdAt:
                        activeProject.createdAt,
                }
                : undefined,
        );

    const handle =
        await saveProjectAs(
            project,
        );

    if (!handle) {
        return false;
    }

    const fileName =
        getFileName(
            project.name,
        );

    projectStore.setFileHandle(
        handle,
    );

    projectStore.setProjectName(
        fileName,
    );

    setActiveProject(
        project,
    );

    await putRecentProject({
        id: project.id,

        name: project.name,

        fileName,

        lastOpened:
            new Date().toISOString(),

        handle,
    });

    notifyRecentProjectsUpdated();

    projectStore.markSaved();

    return true;
}