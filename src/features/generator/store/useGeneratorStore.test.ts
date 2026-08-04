import { beforeEach, describe, expect, it } from "vitest";

import { useGeneratorStore } from "./useGeneratorStore";

import type { GeneratedProject } from "../types/GeneratedProject";

function createProject(
    files: GeneratedProject["files"],
): GeneratedProject {
    return {
        framework: "Pytest + Appium",

        generator: "FlowTest Studio",

        generatedAt: new Date("2026-01-01"),

        files,
    };
}

describe("useGeneratorStore", () => {
    beforeEach(() => {
        useGeneratorStore.getState().clear();
    });

    it("has initial state", () => {
        const state =
            useGeneratorStore.getState();

        expect(state.project).toBeNull();

        expect(state.openFiles).toEqual([]);

        expect(state.activeFile).toBeNull();
    });

    it("sets generated project", () => {
        const project =
            createProject([
                {
                    path: "tests/test_generated.py",
                    content: "print('hello')",
                },
            ]);

        useGeneratorStore
            .getState()
            .setProject(project);

        const state =
            useGeneratorStore.getState();

        expect(state.project).toEqual(project);

        expect(state.openFiles).toEqual([
            "tests/test_generated.py",
        ]);

        expect(state.activeFile).toBe(
            "tests/test_generated.py",
        );
    });

    it("opens a new file", () => {
        const project =
            createProject([
                {
                    path: "a.py",
                    content: "",
                },
                {
                    path: "b.py",
                    content: "",
                },
            ]);

        useGeneratorStore
            .getState()
            .setProject(project);

        useGeneratorStore
            .getState()
            .openFile("b.py");

        const state =
            useGeneratorStore.getState();

        expect(state.openFiles).toEqual([
            "a.py",
            "b.py",
        ]);

        expect(state.activeFile).toBe(
            "b.py",
        );
    });

    it("does not open duplicate tabs", () => {
        const project =
            createProject([
                {
                    path: "README.md",
                    content: "",
                },
            ]);

        useGeneratorStore
            .getState()
            .setProject(project);

        useGeneratorStore
            .getState()
            .openFile("README.md");

        useGeneratorStore
            .getState()
            .openFile("README.md");

        expect(
            useGeneratorStore.getState()
                .openFiles,
        ).toEqual([
            "README.md",
        ]);
    });

    it("changes active file", () => {
        const project =
            createProject([
                {
                    path: "a.py",
                    content: "",
                },
                {
                    path: "b.py",
                    content: "",
                },
            ]);

        useGeneratorStore
            .getState()
            .setProject(project);

        useGeneratorStore
            .getState()
            .openFile("b.py");

        useGeneratorStore
            .getState()
            .setActiveFile("a.py");

        expect(
            useGeneratorStore.getState()
                .activeFile,
        ).toBe("a.py");
    });

    it("closes inactive file", () => {
        const project =
            createProject([
                {
                    path: "a.py",
                    content: "",
                },
                {
                    path: "b.py",
                    content: "",
                },
            ]);

        const store =
            useGeneratorStore.getState();

        store.setProject(project);

        store.openFile("b.py");

        store.setActiveFile("a.py");

        store.closeFile("b.py");

        const state =
            useGeneratorStore.getState();

        expect(state.openFiles).toEqual([
            "a.py",
        ]);

        expect(state.activeFile).toBe(
            "a.py",
        );
    });

    it("closes active file and activates previous tab", () => {
        const project =
            createProject([
                {
                    path: "a.py",
                    content: "",
                },
                {
                    path: "b.py",
                    content: "",
                },
                {
                    path: "c.py",
                    content: "",
                },
            ]);

        const store =
            useGeneratorStore.getState();

        store.setProject(project);

        store.openFile("b.py");

        store.openFile("c.py");

        store.closeFile("c.py");

        const state =
            useGeneratorStore.getState();

        expect(state.openFiles).toEqual([
            "a.py",
            "b.py",
        ]);

        expect(state.activeFile).toBe(
            "b.py",
        );
    });

    it("closes the last opened file", () => {
        const project =
            createProject([
                {
                    path: "a.py",
                    content: "",
                },
            ]);

        const store =
            useGeneratorStore.getState();

        store.setProject(project);

        store.closeFile("a.py");

        const state =
            useGeneratorStore.getState();

        expect(state.openFiles).toEqual([]);

        expect(state.activeFile).toBeNull();
    });

    it("clears generator state", () => {
        const project =
            createProject([
                {
                    path: "a.py",
                    content: "",
                },
            ]);

        const store =
            useGeneratorStore.getState();

        store.setProject(project);

        store.clear();

        const state =
            useGeneratorStore.getState();

        expect(state.project).toBeNull();

        expect(state.openFiles).toEqual([]);

        expect(state.activeFile).toBeNull();
    });
});