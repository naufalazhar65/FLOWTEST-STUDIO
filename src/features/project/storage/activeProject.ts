import type { FlowProject } from "../../flow/types/FlowProject";

const ACTIVE_PROJECT_KEY =
    "flowtest.active-project";

const ACTIVE_PROJECT_DATA_KEY =
    "flowtest.active-project-data";

export function setActiveProject(
    project: FlowProject,
): void {
    localStorage.setItem(
        ACTIVE_PROJECT_KEY,
        project.id,
    );

    localStorage.setItem(
        ACTIVE_PROJECT_DATA_KEY,
        JSON.stringify(project),
    );
}

export function getActiveProjectId():
    string | null {
    return localStorage.getItem(
        ACTIVE_PROJECT_KEY,
    );
}

export function getActiveProject():
    FlowProject | null {
    const json =
        localStorage.getItem(
            ACTIVE_PROJECT_DATA_KEY,
        );

    if (!json) {
        return null;
    }

    try {
        return JSON.parse(
            json,
        ) as FlowProject;
    } catch {
        return null;
    }
}

export function clearActiveProject(): void {
    localStorage.removeItem(
        ACTIVE_PROJECT_KEY,
    );

    localStorage.removeItem(
        ACTIVE_PROJECT_DATA_KEY,
    );
}