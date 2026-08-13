import {
    describe,
    expect,
    it,
} from "vitest";

import {
    initialNodes,
    initialEdges,
} from "../data/initialFlow";

import { duplicateNodeAction } from "./duplicateNode";

describe("duplicateNodeAction", () => {
    it("should duplicate the selected node", () => {
        const result = duplicateNodeAction(
            initialNodes,
            initialEdges,
            "1",
        );

        expect(result.nodes).toHaveLength(
            initialNodes.length + 1,
        );

        const duplicatedNode =
            result.nodes.at(-1);

        expect(duplicatedNode).toBeDefined();

        expect(
            duplicatedNode?.id,
        ).not.toBe("1");

        expect(
            duplicatedNode?.data,
        ).toEqual(
            initialNodes[0].data,
        );
    });

    it("should offset the duplicated node position", () => {
        const result = duplicateNodeAction(
            initialNodes,
            initialEdges,
            "1",
        );

        const duplicatedNode =
            result.nodes.at(-1);

        expect(
            duplicatedNode?.position,
        ).toEqual({
            x:
                initialNodes[0].position.x +
                60,
            y:
                initialNodes[0].position.y +
                60,
        });
    });

    it("should mark the duplicated node as unselected", () => {
        const nodes = structuredClone(
            initialNodes,
        );

        nodes[0].selected = true;

        const result =
            duplicateNodeAction(
                nodes,
                initialEdges,
                "1",
            );

        const duplicatedNode =
            result.nodes.at(-1);

        expect(
            duplicatedNode?.selected,
        ).toBe(false);
    });

    it("should create an edge when the source has exactly one output", () => {
        const result = duplicateNodeAction(
            initialNodes,
            initialEdges,
            "1",
        );

        const duplicatedNode =
            result.nodes.at(-1);

        expect(
            result.edges,
        ).toHaveLength(
            initialEdges.length + 1,
        );

        expect(
            result.edges.at(-1),
        ).toMatchObject({
            source: "1",
            target: duplicatedNode?.id,
            sourceHandle: "next",
        });
    });

    it("should not create an edge when the source has multiple outputs", () => {
        const ifNode = {
            ...initialNodes[0],
            id: "if-node",
            data: {
                action: "if" as const,
                title: "If",
                subtitle: "Condition",
                actual: "value",
                expected: "value",
                operator: "equals" as const,
                debug: {
                    breakpoint: false,
                },
            },
        };

        const nodes = [
            ifNode,
            ...initialNodes.slice(1),
        ];

        const result =
            duplicateNodeAction(
                nodes,
                initialEdges,
                "if-node",
            );

        expect(result.nodes).toHaveLength(
            nodes.length + 1,
        );

        expect(result.edges).toHaveLength(
            initialEdges.length,
        );
    });

    it("should return the original graph when the node does not exist", () => {
        const result = duplicateNodeAction(
            initialNodes,
            initialEdges,
            "missing-node",
        );

        expect(result.nodes).toBe(
            initialNodes,
        );

        expect(result.edges).toBe(
            initialEdges,
        );
    });

    it("should not mutate the original node", () => {
        const nodes = structuredClone(
            initialNodes,
        );

        const originalNode =
            nodes[0];

        const result =
            duplicateNodeAction(
                nodes,
                initialEdges,
                "1",
            );

        const duplicatedNode =
            result.nodes.at(-1);

        expect(
            duplicatedNode?.data,
        ).not.toBe(
            originalNode.data,
        );

        expect(
            originalNode.id,
        ).toBe("1");

        expect(
            originalNode.position,
        ).toEqual({
            x: 250,
            y: 80,
        });
    });
});