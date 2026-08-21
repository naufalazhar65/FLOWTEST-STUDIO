import { useFlowStore } from "../../flow/store/useFlowStore";
import { importProject } from "../../flow/services/importService";

import { useProjectStore } from "../store/useProjectStore";
import { useWorkspaceStore } from "../../workspace/store/useWorkspaceStore";

import { openProject } from "./fileSystem/openProject";

import { putRecentProject } from "../storage/db/projects";
import {
    setActiveProject,
} from "../storage/activeProject";
import {
    notifyRecentProjectsUpdated,
} from "./recentProjectsEvents";

export async function openProjectWorkflow() {
    const result =
        await openProject();

    if (!result) {
        return false;
    }

    const project =
        await importProject(
            result.file,
        );

    const projectName =
        result.file.name.replace(
            /\.flow$/i,
            "",
        );

    const loadedProject = {
        ...project,

        name:
            projectName,

        updatedAt:
            new Date().toISOString(),
    };

    useFlowStore
        .getState()
        .loadProject(
            loadedProject,
        );

    useProjectStore
        .getState()
        .setProjectName(
            result.file.name,
        );

    useProjectStore
        .getState()
        .setFileHandle(
            result.handle,
        );

    useProjectStore
        .getState()
        .markSaved();

    setActiveProject(
        loadedProject,
    );

    await putRecentProject({
        id:
            loadedProject.id,

        name:
            loadedProject.name,

        fileName:
            result.file.name,

        lastOpened:
            new Date().toISOString(),

        handle:
            result.handle,
    });

    notifyRecentProjectsUpdated();

    useWorkspaceStore
        .getState()
        .openWorkspace();

    return true;
}