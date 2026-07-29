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
        edges
    );

    it("returns the start node", () => {
        expect(
            graph.getStartNode()?.id
        ).toBe("A");
    });

    it("returns outgoing edges", () => {
        expect(
            graph.getOutgoingEdges("A")
        ).toHaveLength(1);
    });

    it("returns incoming edges", () => {
        expect(
            graph.getIncomingEdges("B")
        ).toHaveLength(1);
    });

    it("returns the next node", () => {
        expect(
            graph.getNextNode("A")?.id
        ).toBe("B");
    });

    it("returns the next node for a specific handle", () => {
        expect(
            graph.getNextNode("B", "true")?.id
        ).toBe("C");
    });

    it("returns null when no matching edge exists", () => {
        expect(
            graph.getNextNode("B", "false")
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
            graph.getStartNode()
        ).toBeNull();
    });
});