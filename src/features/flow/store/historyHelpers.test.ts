import { describe, expect, it } from "vitest";

import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";
import type { FlowSnapshot } from "../types/FlowSnapshot";

import { pushHistory } from "./historyHelpers";

describe("pushHistory", () => {
    const nodes: FlowNode[] = [
        {
            id: "node-1",
            type: "flow",
            position: {
                x: 250,
                y: 80,
            },
            data: {
                action: "tap",
                title: "Tap",
                subtitle: "Tap an element",
                locatorStrategy: "id",
                locator: "button",
                debug: {
                    breakpoint: false,
                },
            },
        },
    ];

    const edges: Edge[] = [];

    it("should append a new snapshot", () => {
        const history: FlowSnapshot[] = [];

        const result = pushHistory(
            history,
            nodes,
            edges,
        );

        expect(result).toHaveLength(1);

        expect(result[0]).toEqual({
            nodes,
            edges,
        });
    });

    it("should preserve existing history", () => {
        const previousSnapshot: FlowSnapshot = {
            nodes: [],
            edges: [],
        };

        const history = [
            previousSnapshot,
        ];

        const result = pushHistory(
            history,
            nodes,
            edges,
        );

        expect(result).toHaveLength(2);

        expect(result[0]).toBe(
            previousSnapshot,
        );
    });

    it("should clone nodes and edges", () => {
        const history: FlowSnapshot[] = [];

        const result = pushHistory(
            history,
            nodes,
            edges,
        );

        expect(result[0].nodes).not.toBe(
            nodes,
        );

        expect(result[0].edges).not.toBe(
            edges,
        );
    });

    it("should not mutate the original nodes", () => {
        const history: FlowSnapshot[] = [];

        const result = pushHistory(
            history,
            nodes,
            edges,
        );

        result[0].nodes[0].position.x =
            999;

        expect(nodes[0].position.x).toBe(
            250,
        );
    });

    it("should not mutate the original edges", () => {
        const existingEdge: Edge = {
            id: "edge-1",
            source: "node-1",
            target: "node-2",
            type: "flow",
        };

        const result = pushHistory(
            [],
            nodes,
            [existingEdge],
        );

        result[0].edges[0].source =
            "changed";

        expect(
            existingEdge.source,
        ).toBe("node-1");
    });
});