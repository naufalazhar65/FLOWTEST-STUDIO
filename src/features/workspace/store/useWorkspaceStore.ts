import { create } from "zustand";

import type { WorkspaceMode } from "../types/WorkspaceMode";

interface WorkspaceStore {
    mode: WorkspaceMode;

    createProjectOpen: boolean;

    openWorkspace(): void;

    showWelcome(): void;

    openCreateProject(): void;

    closeCreateProject(): void;
}

export const useWorkspaceStore =
    create<WorkspaceStore>((set) => ({
        mode: "welcome",

        createProjectOpen: false,

        openWorkspace() {
            set({
                mode: "workspace",
            });
        },

        showWelcome() {
            set({
                mode: "welcome",
            });
        },

        openCreateProject() {
            set({
                createProjectOpen: true,
            });
        },

        closeCreateProject() {
            set({
                createProjectOpen: false,
            });
        },
    }));