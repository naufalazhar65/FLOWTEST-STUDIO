import {
    describe,
    expect,
    it,
} from "vitest";

import type { Edge } from "reactflow";

import type { FlowNode } from "../../flow/types/flowNode";

import { GraphNavigator } from "../../execution/graph/GraphNavigator";

describe("If branch graph", () => {
    it("resolves true and false transitions", () => {
        const nodes: FlowNode[] = [
            {
                id: "if-1",
            } as FlowNode,

            {
                id: "tap-true",
            } as FlowNode,

            {
                id: "tap-false",
            } as FlowNode,
        ];

        const edges: Edge[] = [
            {
                id: "if-true",
                source: "if-1",
                sourceHandle: "true",
                target: "tap-true",
            },

            {
                id: "if-false",
                source: "if-1",
                sourceHandle: "false",
                target: "tap-false",
            },
        ];

        const graph =
            new GraphNavigator(
                nodes,
                edges,
            );

        const trueTransition =
            graph.getTransition(
                "if-1",
                "true",
            );

        const falseTransition =
            graph.getTransition(
                "if-1",
                "false",
            );

        expect(
            trueTransition,
        ).not.toBeNull();

        expect(
            trueTransition?.edge.sourceHandle,
        ).toBe("true");

        expect(
            trueTransition?.nextNode.id,
        ).toBe("tap-true");

        expect(
            falseTransition,
        ).not.toBeNull();

        expect(
            falseTransition?.edge.sourceHandle,
        ).toBe("false");

        expect(
            falseTransition?.nextNode.id,
        ).toBe("tap-false");
    });

    it("returns null for an unavailable branch", () => {
        const nodes: FlowNode[] = [
            {
                id: "if-1",
            } as FlowNode,

            {
                id: "tap-true",
            } as FlowNode,
        ];

        const edges: Edge[] = [
            {
                id: "if-true",
                source: "if-1",
                sourceHandle: "true",
                target: "tap-true",
            },
        ];

        const graph =
            new GraphNavigator(
                nodes,
                edges,
            );

        expect(
            graph.getTransition(
                "if-1",
                "false",
            ),
        ).toBeNull();
    });
});