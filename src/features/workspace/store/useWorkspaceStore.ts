import { create } from "zustand";

import type { WorkspaceMode } from "../types/WorkspaceMode";
import type { WorkspaceView } from "../types/WorkspaceView";

interface WorkspaceStore {
    mode: WorkspaceMode;

    view: WorkspaceView;

    openWorkspace(): void;

    showWelcome(): void;

    setView(view: WorkspaceView): void;

    createProjectOpen: boolean;

    openCreateProject(): void;

    closeCreateProject(): void;
}

export const useWorkspaceStore =
    create<WorkspaceStore>((set) => ({
        mode: "welcome",

        view: "flow",

        createProjectOpen: false,

        openWorkspace() {
            set({
                mode: "workspace",
                view: "flow",
            });
        },

        showWelcome() {
            set({
                mode: "welcome",
            });
        },

        setView(view) {
            set({
                view,
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