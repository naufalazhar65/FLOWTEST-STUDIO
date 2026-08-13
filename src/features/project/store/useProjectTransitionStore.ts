import { create } from "zustand";

export type ProjectTransitionAction =
    | "new"
    | "open"
    | "close";

interface ProjectTransitionState {
    pendingAction:
    | ProjectTransitionAction
    | null;

    requestTransition(
        action: ProjectTransitionAction,
    ): void;

    clearTransition(): void;
}

export const useProjectTransitionStore =
    create<ProjectTransitionState>(
        (set) => ({
            pendingAction: null,

            requestTransition(action) {
                set({
                    pendingAction: action,
                });
            },

            clearTransition() {
                set({
                    pendingAction: null,
                });
            },
        }),
    );