import { beforeEach, describe, expect, it } from "vitest";

import { useGeneratorStore } from "./useGeneratorStore";

import type { GeneratedProject } from "../types/GeneratedProject";

describe("useGeneratorStore", () => {
    beforeEach(() => {
        useGeneratorStore.getState().clear();
    });

    it("sets generated project", () => {
        const project: GeneratedProject = {
            files: [
                {
                    path: "tests/test_generated.py",
                    content: "print('hello')",
                },
            ],
        };

        useGeneratorStore
            .getState()
            .setProject(project);

        const state =
            useGeneratorStore.getState();

        expect(state.project).toEqual(project);

        expect(state.selectedFile).toBe(
            "tests/test_generated.py",
        );
    });

    it("selects generated file", () => {
        const project: GeneratedProject = {
            files: [
                {
                    path: "tests/test_generated.py",
                    content: "print('hello')",
                },
                {
                    path: "README.md",
                    content: "# README",
                },
            ],
        };

        useGeneratorStore
            .getState()
            .setProject(project);

        useGeneratorStore
            .getState()
            .selectFile("README.md");

        expect(
            useGeneratorStore.getState()
                .selectedFile,
        ).toBe("README.md");
    });

    it("clears generated project", () => {
        const project: GeneratedProject = {
            files: [
                {
                    path: "tests/test_generated.py",
                    content: "print('hello')",
                },
            ],
        };

        useGeneratorStore
            .getState()
            .setProject(project);

        useGeneratorStore
            .getState()
            .clear();

        const state =
            useGeneratorStore.getState();

        expect(state.project).toBeNull();

        expect(state.selectedFile).toBeNull();
    });
});