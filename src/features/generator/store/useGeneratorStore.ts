import { create } from "zustand";

import type { GeneratedProject } from "../types/GeneratedProject";

interface GeneratorState {
    project: GeneratedProject | null;

    openFiles: string[];

    activeFile: string | null;

    setProject(
        project: GeneratedProject,
    ): void;

    openFile(
        path: string,
    ): void;

    closeFile(
        path: string,
    ): void;

    setActiveFile(
        path: string,
    ): void;

    clear(): void;
}

export const useGeneratorStore =
    create<GeneratorState>((set) => ({
        project: null,

        openFiles: [],

        activeFile: null,

        setProject(project) {
            const first =
                project.files[0]?.path ?? null;

            set({
                project,

                openFiles:
                    first ? [first] : [],

                activeFile: first,
            });
        },

        openFile(path) {
            set((state) => ({
                openFiles: state.openFiles.includes(path)
                    ? state.openFiles
                    : [...state.openFiles, path],

                activeFile: path,
            }));
        },

        closeFile(path) {
            set((state) => {
                const files =
                    state.openFiles.filter(
                        (f) => f !== path,
                    );

                return {
                    openFiles: files,

                    activeFile:
                        state.activeFile === path
                            ? files.at(-1) ?? null
                            : state.activeFile,
                };
            });
        },

        setActiveFile(path) {
            set({
                activeFile: path,
            });
        },

        clear() {
            set({
                project: null,

                openFiles: [],

                activeFile: null,
            });
        },
    }));