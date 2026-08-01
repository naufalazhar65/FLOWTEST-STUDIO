import { create } from "zustand";

export interface ProjectState {
    name: string;

    fileHandle: FileSystemFileHandle | null;

    isModified: boolean;

    setProjectName(
        name: string,
    ): void;

    setFileHandle(
        handle: FileSystemFileHandle | null,
    ): void;

    markModified(): void;

    markSaved(): void;

    reset(): void;
}

export const useProjectStore =
    create<ProjectState>((set) => ({
        name: "Untitled.flow",

        fileHandle: null,

        isModified: false,

        setProjectName(name) {
            set({
                name,
            });
        },

        setFileHandle(handle) {
            set({
                fileHandle: handle,
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

                fileHandle: null,

                isModified: false,
            });
        },
    }));