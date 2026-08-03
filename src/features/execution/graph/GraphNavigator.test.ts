import { describe, expect, it } from "vitest";

import { GraphNavigator } from "./GraphNavigator";

import type { Edge } from "reactflow";
import type { FlowNode } from "../../flow/types/flowNode";

describe("GraphNavigator", () => {
    const nodes: FlowNode[] = [
        { id: "A" } as FlowNode,
        { id: "B" } as FlowNode,
        { id: "C" } as FlowNode,
    ];

    const edges: Edge[] = [
        {
            id: "1",
            source: "A",
            target: "B",
        },
        {
            id: "2",
            source: "B",
            sourceHandle: "true",
            target: "C",
        },
    ];

    const graph = new GraphNavigator(
        nodes,
        edges,
    );

    it("returns the start node", () => {
        expect(
            graph.getStartNode()?.id,
        ).toBe("A");
    });

    it("returns outgoing edges", () => {
        expect(
            graph.getOutgoingEdges("A"),
        ).toHaveLength(1);
    });

    it("returns incoming edges", () => {
        expect(
            graph.getIncomingEdges("B"),
        ).toHaveLength(1);
    });

    it("returns the next node", () => {
        expect(
            graph.getNextNode("A")?.id,
        ).toBe("B");
    });

    it("returns the next node for a specific handle", () => {
        expect(
            graph.getNextNode(
                "B",
                "true",
            )?.id,
        ).toBe("C");
    });

    it("returns null when no matching edge exists", () => {
        expect(
            graph.getNextNode(
                "B",
                "false",
            ),
        ).toBeNull();
    });

    it("returns null when there is no start node", () => {
        const graph = new GraphNavigator(
            [
                { id: "A" } as FlowNode,
                { id: "B" } as FlowNode,
            ],
            [
                {
                    id: "1",
                    source: "A",
                    target: "B",
                },
                {
                    id: "2",
                    source: "B",
                    target: "A",
                },
            ],
        );

        expect(
            graph.getStartNode(),
        ).toBeNull();
    });

    it("returns transition for default output", () => {
        const transition =
            graph.getTransition("A");

        expect(
            transition,
        ).not.toBeNull();

        expect(
            transition?.edge.id,
        ).toBe("1");

        expect(
            transition?.nextNode.id,
        ).toBe("B");
    });

    it("returns transition for specific output handle", () => {
        const transition =
            graph.getTransition(
                "B",
                "true",
            );

        expect(
            transition,
        ).not.toBeNull();

        expect(
            transition?.edge.id,
        ).toBe("2");

        expect(
            transition?.nextNode.id,
        ).toBe("C");
    });

    it("returns null when transition edge does not exist", () => {
        expect(
            graph.getTransition(
                "B",
                "false",
            ),
        ).toBeNull();
    });

    it("returns null when transition target node is missing", () => {
        const graph = new GraphNavigator(
            [
                { id: "A" } as FlowNode,
            ],
            [
                {
                    id: "1",
                    source: "A",
                    target: "UNKNOWN",
                },
            ],
        );

        expect(
            graph.getTransition("A"),
        ).toBeNull();
    });

    it("returns execution order using default output", () => {
        const graph = new GraphNavigator(
            [
                { id: "A" } as FlowNode,
                { id: "B" } as FlowNode,
                { id: "C" } as FlowNode,
            ],
            [
                {
                    id: "1",
                    source: "A",
                    target: "B",
                },
                {
                    id: "2",
                    source: "B",
                    target: "C",
                },
            ],
        );

        expect(
            graph
                .getExecutionOrder()
                .map(
                    (node) => node.id,
                ),
        ).toEqual([
            "A",
            "B",
            "C",
        ]);
    });

    it("returns empty execution order when no start node exists", () => {
        const graph = new GraphNavigator(
            [
                { id: "A" } as FlowNode,
                { id: "B" } as FlowNode,
            ],
            [
                {
                    id: "1",
                    source: "A",
                    target: "B",
                },
                {
                    id: "2",
                    source: "B",
                    target: "A",
                },
            ],
        );

        expect(
            graph.getExecutionOrder(),
        ).toEqual([]);
    });

    it("does not loop forever when graph contains a cycle", () => {
        const graph = new GraphNavigator(
            [
                { id: "A" } as FlowNode,
                { id: "B" } as FlowNode,
                { id: "C" } as FlowNode,
            ],
            [
                {
                    id: "1",
                    source: "A",
                    target: "B",
                },
                {
                    id: "2",
                    source: "B",
                    target: "C",
                },
                {
                    id: "3",
                    source: "C",
                    target: "B",
                },
            ],
        );

        expect(
            graph
                .getExecutionOrder()
                .map(
                    (node) => node.id,
                ),
        ).toEqual([
            "A",
            "B",
            "C",
        ]);
    });
});