import {
    describe,
    expect,
    it,
} from "vitest";

import {
    initialNodes,
    initialEdges,
} from "../data/initialFlow";

import { addNodeAction } from "./addNode";

describe("addNodeAction", () => {
    it("should add a node after the last node", () => {
        const result = addNodeAction(
            initialNodes,
            initialEdges,
            "tap",
        );

        expect(result.nodes).toHaveLength(
            initialNodes.length + 1,
        );

        const newNode =
            result.nodes.at(-1);

        expect(newNode).toBeDefined();

        expect(newNode?.data.action).toBe(
            "tap",
        );
    });

    it("should connect the new node to the previous last node", () => {
        const result = addNodeAction(
            initialNodes,
            initialEdges,
            "tap",
        );

        const newNode =
            result.nodes.at(-1);

        const lastNode =
            initialNodes.at(-1);

        expect(
            result.edges,
        ).toHaveLength(
            initialEdges.length + 1,
        );

        expect(result.edges.at(-1)).toMatchObject({
            source: lastNode?.id,
            target: newNode?.id,
        });
    });

    it("should place the first node at the default position", () => {
        const result = addNodeAction(
            [],
            [],
            "tap",
        );

        expect(
            result.nodes[0].position,
        ).toEqual({
            x: 250,
            y: 80,
        });

        expect(result.edges).toEqual([]);
    });

    it("should place a new node 180px below the last node", () => {
        const nodes = [
            {
                ...initialNodes[0],
                position: {
                    x: 500,
                    y: 600,
                },
            },
        ];

        const result = addNodeAction(
            nodes,
            [],
            "tap",
        );

        expect(
            result.nodes.at(-1)?.position,
        ).toEqual({
            x: 250,
            y: 780,
        });
    });

    it("should not mutate the original nodes or edges", () => {
        const nodes = structuredClone(
            initialNodes,
        );

        const edges = structuredClone(
            initialEdges,
        );

        addNodeAction(
            nodes,
            edges,
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