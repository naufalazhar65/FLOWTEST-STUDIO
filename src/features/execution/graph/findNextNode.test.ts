import { describe, expect, it } from "vitest";

import { findNextNode } from "./findNextNode";

import type { Edge } from "reactflow";
import type { FlowNode } from "../../flow/types/flowNode";

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
        source: "A",
        sourceHandle: "true",
        target: "C",
    },
    {
        id: "3",
        source: "A",
        sourceHandle: "false",
        target: "B",
    },
];

describe("findNextNode", () => {
    it("returns next node using default handle", () => {
        // Arrange

        // Act
        const result = findNextNode(
            "A",
            "next",
            nodes,
            edges
        );

        // Assert
        expect(result?.id).toBe("B");
    });

    it("returns node for true handle", () => {
        // Act
        const result = findNextNode(
            "A",
            "true",
            nodes,
            edges
        );

        // Assert
        expect(result?.id).toBe("C");
    });

    it("returns node for false handle", () => {
        // Act
        const result = findNextNode(
            "A",
            "false",
            nodes,
            edges
        );

        // Assert
        expect(result?.id).toBe("B");
    });

    it("returns null when handle does not exist", () => {
        // Act
        const result = findNextNode(
            "A",
            "invalid",
            nodes,
            edges
        );

        // Assert
        expect(result).toBeNull();
    });

    it("returns null when source node has no outgoing edge", () => {
        // Act
        const result = findNextNode(
            "Z",
            "next",
            nodes,
            edges
        );

        // Assert
        expect(result).toBeNull();
    });

    it("returns null when target node does not exist", () => {
        // Arrange
        const invalidEdges: Edge[] = [
            {
                id: "1",
                source: "A",
                target: "UNKNOWN",
            },
        ];

        // Act
        const result = findNextNode(
            "A",
            "next",
            nodes,
            invalidEdges
        );

        // Assert
        expect(result).toBeNull();
    });
});