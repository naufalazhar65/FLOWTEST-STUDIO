import { describe, expect, it } from "vitest";

import type {
    Connection,
    Edge,
} from "reactflow";

import { connectNodesAction } from "./connectNodes";

describe("connectNodesAction", () => {
    it("should create a new edge", () => {
        const edges: Edge[] = [];

        const connection: Connection = {
            source: "node-1",
            target: "node-2",
            sourceHandle: null,
            targetHandle: null,
        };

        const result = connectNodesAction(
            edges,
            connection,
        );

        expect(result).toHaveLength(1);

        expect(result[0]).toMatchObject({
            source: "node-1",
            target: "node-2",
            type: "flow",
            animated: false,
        });
    });

    it("should preserve source and target handles", () => {
        const edges: Edge[] = [];

        const connection: Connection = {
            source: "node-1",
            target: "node-2",
            sourceHandle: "true",
            targetHandle: "input",
        };

        const result = connectNodesAction(
            edges,
            connection,
        );

        expect(result[0]).toMatchObject({
            source: "node-1",
            target: "node-2",
            sourceHandle: "true",
            targetHandle: "input",
        });
    });

    it("should preserve existing edges", () => {
        const existingEdge: Edge = {
            id: "edge-1",
            source: "node-1",
            target: "node-2",
            type: "flow",
            animated: false,
        };

        const connection: Connection = {
            source: "node-2",
            target: "node-3",
            sourceHandle: null,
            targetHandle: null,
        };

        const result = connectNodesAction(
            [existingEdge],
            connection,
        );

        expect(result).toHaveLength(2);

        expect(result[0]).toEqual(
            existingEdge,
        );

        expect(result[1]).toMatchObject({
            source: "node-2",
            target: "node-3",
        });
    });

    it("should return the original edges when source is missing", () => {
        const edges: Edge[] = [];

        const connection: Connection = {
            source: null,
            target: "node-2",
            sourceHandle: null,
            targetHandle: null,
        };

        const result = connectNodesAction(
            edges,
            connection,
        );

        expect(result).toBe(edges);
    });

    it("should return the original edges when target is missing", () => {
        const edges: Edge[] = [];

        const connection: Connection = {
            source: "node-1",
            target: null,
            sourceHandle: null,
            targetHandle: null,
        };

        const result = connectNodesAction(
            edges,
            connection,
        );

        expect(result).toBe(edges);
    });
});