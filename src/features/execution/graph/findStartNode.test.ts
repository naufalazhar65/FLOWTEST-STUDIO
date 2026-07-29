import { describe, expect, it } from "vitest";

import { findStartNode } from "./findStartNode";

import type { Edge } from "reactflow";
import type { FlowNode } from "../../flow/types/flowNode";

describe("findStartNode", () => {
    it("returns the first node without incoming edges", () => {
        // Arrange
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
                target: "C",
            },
        ];

        // Act
        const result = findStartNode(
            nodes,
            edges
        );

        // Assert
        expect(result?.id).toBe("A");
    });

    it("returns the first valid start node when multiple exist", () => {
        // Arrange
        const nodes: FlowNode[] = [
            { id: "A" } as FlowNode,
            { id: "B" } as FlowNode,
            { id: "C" } as FlowNode,
        ];

        const edges: Edge[] = [
            {
                id: "1",
                source: "B",
                target: "C",
            },
        ];

        // Act
        const result = findStartNode(
            nodes,
            edges
        );

        // Assert
        expect(result?.id).toBe("A");
    });

    it("returns null when every node has an incoming edge", () => {
        // Arrange
        const nodes: FlowNode[] = [
            { id: "A" } as FlowNode,
            { id: "B" } as FlowNode,
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
                target: "A",
            },
        ];

        // Act
        const result = findStartNode(
            nodes,
            edges
        );

        // Assert
        expect(result).toBeNull();
    });

    it("returns null when node list is empty", () => {
        // Arrange
        const nodes: FlowNode[] = [];
        const edges: Edge[] = [];

        // Act
        const result = findStartNode(
            nodes,
            edges
        );

        // Assert
        expect(result).toBeNull();
    });

    it("returns the only node when there are no edges", () => {
        // Arrange
        const nodes: FlowNode[] = [
            { id: "A" } as FlowNode,
        ];

        const edges: Edge[] = [];

        // Act
        const result = findStartNode(
            nodes,
            edges
        );

        // Assert
        expect(result?.id).toBe("A");
    });
});