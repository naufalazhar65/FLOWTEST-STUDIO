import { useFlowStore } from "../../flow/store/useFlowStore";
import { importProject } from "../../flow/services/importService";

import { useProjectStore } from "../store/useProjectStore";
import { useWorkspaceStore } from "../../workspace/store/useWorkspaceStore";

import { putRecentProject } from "../storage/db/projects";

import {
    setActiveProject,
} from "../storage/activeProject";

import type {
    RecentProject,
} from "../types/RecentProject";

export async function openRecentProjectWorkflow(
    recentProject: RecentProject,
) {
    try {
        const handle =
            recentProject.handle;

        const permission =
            await handle.queryPermission({
                mode: "read",
            });

        if (permission !== "granted") {
            const requested =
                await handle.requestPermission({
                    mode: "read",
                });

            if (requested !== "granted") {
                return false;
            }
        }

        const file =
            await handle.getFile();

        const project =
            await importProject(file);

        // Load project
        useFlowStore
            .getState()
            .loadProject(project);

        // Update project metadata
        useProjectStore
            .getState()
            .setProjectName(
                recentProject.fileName,
            );

        useProjectStore
            .getState()
            .setFileHandle(
                handle,
            );

        useProjectStore
            .getState()
            .markSaved();

        // IMPORTANT:
        // Mark this project as the active project
        setActiveProject(project);

        // Update Recent Projects
        await putRecentProject({
            ...recentProject,

            lastOpened:
                new Date().toISOString(),
        });

        // Open workspace
        useWorkspaceStore
            .getState()
            .openWorkspace();

        return true;
    } catch (error) {
        console.error(
            "Failed to open recent project:",
            error,
        );

        return false;
    }
}