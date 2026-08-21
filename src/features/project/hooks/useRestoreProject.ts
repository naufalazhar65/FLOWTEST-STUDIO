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
                /*
                 * Restore the project flow.
                 */
                useFlowStore
                    .getState()
                    .loadProject(
                        project,
                    );

                /*
                 * Restore the project name.
                 */
                useProjectStore
                    .getState()
                    .setProjectName(
                        `${project.name}.flow`,
                    );

                /*
                 * Restore the original file handle
                 * from Recent Projects.
                 *
                 * This allows the regular Save action
                 * to write directly back to the same
                 * file instead of opening Save As.
                 */
                const recentProject =
                    await getRecentProject(
                        project.id,
                    );

                if (cancelled) {
                    return;
                }

                useProjectStore
                    .getState()
                    .setFileHandle(
                        recentProject?.handle ??
                        null,
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