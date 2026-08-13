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

import { deleteNodeAction } from "./deleteNode";

describe("deleteNodeAction", () => {
    it("should remove the target node", () => {
        const result = deleteNodeAction(
            initialNodes,
            initialEdges,
            "2",
        );

        expect(
            result.nodes.some(
                (node) => node.id === "2",
            ),
        ).toBe(false);

        expect(result.nodes).toHaveLength(2);
    });

    it("should reconnect incoming and outgoing edges", () => {
        const result = deleteNodeAction(
            initialNodes,
            initialEdges,
            "2",
        );

        expect(result.edges).toHaveLength(1);

        expect(result.edges[0]).toMatchObject({
            source: "1",
            target: "3",
        });
    });

    it("should remove all edges connected to the deleted node", () => {
        const result = deleteNodeAction(
            initialNodes,
            initialEdges,
            "2",
        );

        expect(
            result.edges.some(
                (edge) =>
                    edge.source === "2" ||
                    edge.target === "2",
            ),
        ).toBe(false);
    });

    it("should preserve unrelated nodes and edges", () => {
        const nodes = structuredClone(
            initialNodes,
        );

        const edges: Edge[] = [
            ...structuredClone(initialEdges),
            {
                id: "unrelated",
                source: "10",
                target: "11",
                type: "flow",
            },
        ];

        const result = deleteNodeAction(
            nodes,
            edges,
            "2",
        );

        expect(
            result.nodes.find(
                (node) => node.id === "1",
            ),
        ).toEqual(nodes[0]);

        expect(
            result.edges.find(
                (edge) =>
                    edge.id === "unrelated",
            ),
        ).toEqual(
            edges.find(
                (edge) =>
                    edge.id === "unrelated",
            ),
        );
    });

    it("should not change the graph when the node does not exist", () => {
        const result = deleteNodeAction(
            initialNodes,
            initialEdges,
            "missing-node",
        );

        expect(result.nodes).toEqual(
            initialNodes,
        );

        expect(result.edges).toEqual(
            initialEdges,
        );
    });

    it("should preserve edge handles when reconnecting", () => {
        const nodes = structuredClone(
            initialNodes,
        );

        const edges: Edge[] = [
            {
                id: "incoming",
                source: "1",
                target: "2",
                sourceHandle: "next",
                targetHandle: "input",
                type: "flow",
            },
            {
                id: "outgoing",
                source: "2",
                target: "3",
                sourceHandle: "output",
                targetHandle: "target",
                type: "flow",
            },
        ];

        const result = deleteNodeAction(
            nodes,
            edges,
            "2",
        );

        expect(result.edges).toHaveLength(1);

        expect(result.edges[0]).toMatchObject({
            source: "1",
            target: "3",
            sourceHandle: "next",
            targetHandle: "target",
        });
    });
});