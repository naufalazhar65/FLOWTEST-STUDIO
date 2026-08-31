import {
    describe,
    expect,
    it,
} from "vitest";

import type { FlowProject } from "../../flow/types/FlowProject";

import type { FlowNodeData } from "../../flow/types/flowNode";

import {
    deserializeProject,
    serializeProject,
} from "./flowFileFormat";

function makeProject(): FlowProject {
    return {
        id: "proj-1",
        name: "Android Flow",
        createdAt: "2026-08-31T00:00:00.000Z",
        updatedAt: "2026-08-31T00:00:00.000Z",
        nodes: [
            {
                id: "n1",
                type: "tap",
                position: { x: 10, y: 20 },
                data: { action: "tap", title: "Tap" } as FlowNodeData,
                width: 240,
                height: 80,
                selected: true,
                dragging: false,
                positionAbsolute: { x: 10, y: 20 },
            },
            {
                id: "n2",
                type: "launchApp",
                position: { x: 80, y: 200 },
                data: { action: "launchApp", appPackage: "com.example" } as FlowNodeData,
            },
        ],
        edges: [
            {
                id: "e1",
                source: "n1",
                target: "n2",
                selected: true,
            },
        ],
    };
}

describe(
    "flowFileFormat",
    () => {
        it(
            "serializes project with a formatVersion marker",
            () => {
                const raw =
                    serializeProject(
                        makeProject(),
                    );

                const parsed =
                    JSON.parse(
                        raw,
                    );

                expect(
                    parsed.formatVersion,
                ).toBe(1);
            },
        );

        it(
            "drops transient reactflow fields from nodes on serialize",
            () => {
                const raw =
                    serializeProject(
                        makeProject(),
                    );

                const parsed =
                    JSON.parse(
                        raw,
                    );

                for (
                    const node
                    of parsed.nodes
                ) {
                    expect(
                        node.width,
                    ).toBeUndefined();

                    expect(
                        node.height,
                    ).toBeUndefined();

                    expect(
                        node.selected,
                    ).toBeUndefined();

                    expect(
                        node.dragging,
                    ).toBeUndefined();

                    expect(
                        node.positionAbsolute,
                    ).toBeUndefined();
                }
            },
        );

        it(
            "keeps meaningful node data intact",
            () => {
                const raw =
                    serializeProject(
                        makeProject(),
                    );

                const parsed =
                    JSON.parse(
                        raw,
                    );

                expect(
                    parsed.nodes[0].id,
                ).toBe("n1");

                expect(
                    parsed.nodes[0].type,
                ).toBe("tap");

                expect(
                    parsed.nodes[0].position,
                ).toEqual({
                    x: 10,
                    y: 20,
                });

                expect(
                    parsed.nodes[0].data,
                ).toEqual({
                    action: "tap",
                    title: "Tap",
                });
            },
        );

        it(
            "round-trips serialize then deserialize to a valid project",
            () => {
                const project =
                    makeProject();

                const roundTripped =
                    deserializeProject(
                        serializeProject(
                            project,
                        ),
                    );

                expect(
                    roundTripped.id,
                ).toBe(project.id);

                expect(
                    roundTripped.name,
                ).toBe(project.name);

                expect(
                    roundTripped.nodes[0].data,
                ).toEqual(
                    project.nodes[0].data,
                );

                expect(
                    roundTripped.edges[0],
                ).toEqual({
                    id: "e1",
                    source: "n1",
                    target: "n2",
                });
            },
        );

        it(
            "is deterministic across repeated serialization",
            () => {
                const project =
                    makeProject();

                expect(
                    serializeProject(
                        project,
                    ),
                ).toBe(
                    serializeProject(
                        project,
                    ),
                );
            },
        );

        it(
            "loads legacy files without a formatVersion field",
            () => {
                const legacy = JSON.stringify({
                    id: "old",
                    name: "Legacy",
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                    nodes: [
                        {
                            id: "n1",
                            type: "back",
                            position: { x: 0, y: 0 },
                            data: { action: "back" },
                        },
                    ],
                    edges: [],
                });

                const project =
                    deserializeProject(
                        legacy,
                    );

                expect(
                    project.id,
                ).toBe("old");

                expect(
                    project.nodes[0].data,
                ).toEqual({
                    action: "back",
                });

                expect(
                    project.edges,
                ).toEqual([]);
            },
        );
    },
);
