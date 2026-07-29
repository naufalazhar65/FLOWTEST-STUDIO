import { describe, expect, it } from "vitest";

import { findOutgoingEdges } from "./findOutgoingEdges";

import type { Edge } from "reactflow";

describe("findOutgoingEdges", () => {
    const edges: Edge[] = [
        {
            id: "1",
            source: "A",
            target: "B",
        },
        {
            id: "2",
            source: "A",
            target: "C",
        },
        {
            id: "3",
            source: "B",
            target: "D",
        },
    ];

    it("returns all outgoing edges", () => {
        // Act
        const result = findOutgoingEdges(
            "A",
            edges
        );

        // Assert
        expect(result).toHaveLength(2);
        expect(result.map(edge => edge.target))
            .toEqual(["B", "C"]);
    });

    it("returns an empty array when no outgoing edges exist", () => {
        // Act
        const result = findOutgoingEdges(
            "D",
            edges
        );

        // Assert
        expect(result).toEqual([]);
    });
});