import { describe, expect, it } from "vitest";

import { findIncomingEdges } from "./findIncomingEdges";

import type { Edge } from "reactflow";

describe("findIncomingEdges", () => {
    const edges: Edge[] = [
        {
            id: "1",
            source: "A",
            target: "B",
        },
        {
            id: "2",
            source: "C",
            target: "B",
        },
        {
            id: "3",
            source: "B",
            target: "D",
        },
    ];

    it("returns all incoming edges", () => {
        // Act
        const result = findIncomingEdges(
            "B",
            edges
        );

        // Assert
        expect(result).toHaveLength(2);
        expect(result.map(edge => edge.source))
            .toEqual(["A", "C"]);
    });

    it("returns an empty array when no incoming edges exist", () => {
        // Act
        const result = findIncomingEdges(
            "A",
            edges
        );

        // Assert
        expect(result).toEqual([]);
    });
});