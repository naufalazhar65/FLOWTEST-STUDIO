import { create } from "zustand";

export interface ProjectState {
    name: string;

    projectId: string | null;

    fileHandle:
    FileSystemFileHandle | null;

    isModified: boolean;

    setProjectId(
        projectId: string | null,
    ): void;

    setProjectName(
        name: string,
    ): void;

    setFileHandle(
        handle:
            FileSystemFileHandle | null,
    ): void;

    markModified(): void;

    markSaved(): void;

    reset(): void;
}

export const useProjectStore =
    create<ProjectState>(
        (set) => ({
            name: "Untitled.flow",

            projectId: null,

            fileHandle: null,

            isModified: false,

            setProjectId(
                projectId,
            ) {
                set({
                    projectId,
                });
            },

            setProjectName(name) {
                set({
                    name,
                });
            },

            setFileHandle(handle) {
                set({
                    fileHandle:
                        handle,
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

                    projectId: null,

                    fileHandle: null,

                    isModified: false,
                });
            },
        }),
    );