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
                useFlowStore
                    .getState()
                    .loadProject(
                        project,
                    );

                useProjectStore
                    .getState()
                    .setProjectId(
                        project.id,
                    );

                useProjectStore
                    .getState()
                    .setProjectName(
                        `${project.name}.flow`,
                    );

                useProjectStore
                    .getState()
                    .setFileHandle(
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