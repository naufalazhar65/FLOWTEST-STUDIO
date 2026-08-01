import { create } from "zustand";

export interface ProjectState {
    name: string;

    isModified: boolean;

    setProjectName(
        name: string,
    ): void;

    markModified(): void;

    markSaved(): void;

    reset(): void;
}

export const useProjectStore =
    create<ProjectState>((set) => ({
        name: "Untitled.flow",

        isModified: false,

        setProjectName(name) {
            set({
                name,
            });
        },

        markModified() {
            set({
                isModified: true,
            });
        },

        markSaved() {
            set({
                isModified: false,
            });
        },

        reset() {
            set({
                name: "Untitled.flow",
                isModified: false,
            });
        },
    }));