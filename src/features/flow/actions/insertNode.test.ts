import {
    describe,
    expect,
    it,
} from "vitest";

import type { Edge } from "reactflow";

import {
    initialNodes,
    initialEdges,
} from "../data/initialFlow";

import { insertNodeAction } from "./insertNode";

describe("insertNodeAction", () => {
    it("should insert a node between source and target", () => {
        const result = insertNodeAction(
            initialNodes,
            initialEdges,
            "e1",
            "tap",
        );

        expect(result.nodes).toHaveLength(
            initialNodes.length + 1,
        );

        expect(result.edges).toHaveLength(
            initialEdges.length + 1,
        );

        const insertedNode =
            result.nodes.at(-1);

        expect(insertedNode).toBeDefined();

        expect(
            result.edges.some(
                (edge) =>
                    edge.source === "1" &&
                    edge.target === insertedNode?.id,
            ),
        ).toBe(true);

        expect(
            result.edges.some(
                (edge) =>
                    edge.source === insertedNode?.id &&
                    edge.target === "2",
            ),
        ).toBe(true);
    });

    it("should remove the original edge", () => {
        const result = insertNodeAction(
            initialNodes,
            initialEdges,
            "e1",
            "tap",
        );

        expect(
            result.edges.some(
                (edge) => edge.id === "e1",
            ),
        ).toBe(false);
    });

    it("should position the node between source and target", () => {
        const result = insertNodeAction(
            initialNodes,
            initialEdges,
            "e1",
            "tap",
        );

        const insertedNode =
            result.nodes.at(-1);

        expect(
            insertedNode?.position,
        ).toEqual({
            x: 250,
            y: 170,
        });
    });

    it("should preserve source and target handles", () => {
        const edges: Edge[] = [
            {
                id: "edge-with-handles",
                source: "1",
                target: "2",
                sourceHandle: "true",
                targetHandle: "input",
                type: "flow",
            },
        ];

        const result = insertNodeAction(
            initialNodes,
            edges,
            "edge-with-handles",
            "tap",
        );

        const insertedNode =
            result.nodes.at(-1);

        expect(
            result.edges,
        ).toHaveLength(2);

        expect(
            result.edges.find(
                (edge) =>
                    edge.source === "1" &&
                    edge.target ===
                    insertedNode?.id,
            ),
        ).toMatchObject({
            sourceHandle: "true",
        });

        expect(
            result.edges.find(
                (edge) =>
                    edge.source ===
                    insertedNode?.id &&
                    edge.target === "2",
            ),
        ).toMatchObject({
            targetHandle: "input",
        });
    });

    it("should return the original graph when the edge does not exist", () => {
        const result = insertNodeAction(
            initialNodes,
            initialEdges,
            "missing-edge",
            "tap",
        );

        expect(result.nodes).toBe(
            initialNodes,
        );

        expect(result.edges).toBe(
            initialEdges,
        );
    });

    it("should not mutate the original graph", () => {
        const nodes =
            structuredClone(
                initialNodes,
            );

        const edges =
            structuredClone(
                initialEdges,
            );

        insertNodeAction(
            nodes,
            edges,
            "e1",
            "tap",
        );

        expect(nodes).toEqual(
            initialNodes,
        );

        expect(edges).toEqual(
            initialEdges,
        );
    });
});