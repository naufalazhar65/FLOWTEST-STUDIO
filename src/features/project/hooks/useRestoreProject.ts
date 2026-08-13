import { useEffect } from "react";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    useProjectStore,
} from "../store/useProjectStore";

import {
    useWorkspaceStore,
} from "../../workspace/store/useWorkspaceStore";

import {
    getActiveProject,
} from "../storage/activeProject";

import {
    getRecentProject,
} from "../storage/db/projects";

export function useRestoreProject() {
    useEffect(() => {
        let cancelled = false;

        async function restore() {
            const project =
                getActiveProject();

            if (!project) {
                return;
            }

            if (cancelled) {
                return;
            }

            try {
                let fileHandle:
                    | FileSystemFileHandle
                    | null = null;

                const recentProject =
                    await getRecentProject(
                        project.id,
                    );

                if (
                    recentProject
                        ?.handle
                ) {
                    try {
                        const permission =
                            await recentProject.handle.queryPermission(
                                {
                                    mode: "read",
                                },
                            );

                        if (
                            permission ===
                            "granted"
                        ) {
                            fileHandle =
                                recentProject.handle;
                        }
                    } catch (error) {
                        console.warn(
                            "Unable to restore project file handle:",
                            error,
                        );
                    }
                }

                if (cancelled) {
                    return;
                }

                useFlowStore
                    .getState()
                    .loadProject(
                        project,
                    );

                useProjectStore
                    .getState()
                    .setProjectName(
                        `${project.name}.flow`,
                    );

                useProjectStore
                    .getState()
                    .setFileHandle(
                        fileHandle,
                    );

                useProjectStore
                    .getState()
                    .markSaved();

                useWorkspaceStore
                    .getState()
                    .openWorkspace();
            } catch (error) {
                console.error(
                    "Failed to restore active project:",
                    error,
                );
            }
        }

        void restore();

        return () => {
            cancelled = true;
        };
    }, []);
}