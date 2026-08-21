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

import {
    notifyRecentProjectsUpdated,
} from "../services/recentProjectsEvents";

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
            await importProject(
                file,
            );

        const projectName =
            file.name.replace(
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

        // Load project
        useFlowStore
            .getState()
            .loadProject(
                loadedProject,
            );

        // Update project metadata
        useProjectStore
            .getState()
            .setProjectName(
                file.name,
            );

        useProjectStore
            .getState()
            .setFileHandle(
                handle,
            );

        useProjectStore
            .getState()
            .markSaved();

        // Mark the loaded project as active
        setActiveProject(
            loadedProject,
        );

        // Update Recent Projects
        await putRecentProject({
            ...recentProject,

            id:
                loadedProject.id,

            name:
                loadedProject.name,

            fileName:
                file.name,

            lastOpened:
                new Date().toISOString(),

            handle,
        });

        notifyRecentProjectsUpdated();

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