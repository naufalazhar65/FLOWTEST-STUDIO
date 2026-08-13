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

    useFlowStore
        .getState()
        .loadProject(project);

    useProjectStore
        .getState()
        .setProjectName(
            result.file.name.replace(
                /\.json$/i,
                ".flow",
            ),
        );

    useProjectStore
        .getState()
        .setFileHandle(
            result.handle,
        );

    useProjectStore
        .getState()
        .markSaved();

    // Simpan project yang sedang aktif
    setActiveProject(project);

    // Simpan ke Recent Projects
    await putRecentProject({
        id: project.id,

        name: project.name,

        fileName:
            result.file.name,

        lastOpened:
            new Date().toISOString(),

        handle: result.handle,
    });

    notifyRecentProjectsUpdated();

    // Masuk ke Workspace
    useWorkspaceStore
        .getState()
        .openWorkspace();

    return true;
}