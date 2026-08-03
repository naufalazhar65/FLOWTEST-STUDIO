import { describe, expect, it } from "vitest";
import type { Edge } from "reactflow";

import { generateProject } from "./generateProject";

import type {
    FlowNode,
    TapNodeData,
} from "../../flow/types/flowNode";

function createTapNode(): FlowNode & {
    data: TapNodeData;
} {
    return {
        id: "tap-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "tap",

            title: "Tap",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",
        },
    } as FlowNode & {
        data: TapNodeData;
    };
}

const emptyEdges: Edge[] = [];

describe("generateProject", () => {
    it("generates project files", () => {
        const project = generateProject(
            [createTapNode()],
            emptyEdges,
        );

        expect(project.files).toHaveLength(6);
    });

    it("generates python test file", () => {
        const project = generateProject(
            [createTapNode()],
            emptyEdges,
        );

        const file = project.files.find(
            (f) =>
                f.path ===
                "tests/test_generated.py",
        );

        expect(file).toBeDefined();

        expect(file?.content).toContain(
            "def test_generated()",
        );

        expect(file?.content).toContain(
            "tap(",
        );
    });

    it("generates actions runtime", () => {
        const project =
            generateProject(
                [],
                emptyEdges,
            );

        const file = project.files.find(
            (f) =>
                f.path ===
                "framework/actions.py",
        );

        expect(file).toBeDefined();

        expect(file?.content).toContain(
            "def tap",
        );
    });

    it("generates driver runtime", () => {
        const project =
            generateProject(
                [],
                emptyEdges,
            );

        const file = project.files.find(
            (f) =>
                f.path ===
                "framework/driver.py",
        );

        expect(file).toBeDefined();

        expect(file?.content).not.toBe("");
    });

    it("generates variables runtime", () => {
        const project =
            generateProject(
                [],
                emptyEdges,
            );

        const file = project.files.find(
            (f) =>
                f.path ===
                "framework/variables.py",
        );

        expect(file).toBeDefined();

        expect(file?.content).not.toBe("");
    });

    it("contains expected file paths", () => {
        const project =
            generateProject(
                [],
                emptyEdges,
            );

        expect(
            project.files.map(
                (file) => file.path,
            ),
        ).toEqual([
            "tests/test_generated.py",
            "framework/actions.py",
            "framework/driver.py",
            "framework/variables.py",
            "framework/assertions.py",
            "framework/waits.py",
        ]);
    });
});