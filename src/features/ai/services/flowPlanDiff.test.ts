import {
    describe,
    expect,
    it,
} from "vitest";

import {
    createNode,
} from "../../flow/factories/nodeFactory";

import {
    createEdge,
} from "../../flow/factories/edgeFactory";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    Edge,
} from "reactflow";

import {
    computePlanDiff,
} from "./flowPlanDiff";

import type {
    AIFlowPlan,
} from "../types/AIFlowPlan";

import type {
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

describe("computePlanDiff", () => {
    const nodeA = createNode(
        "launchApp",
        undefined,
        {
            x: 250,
            y: 80,
        },
    );

    const nodeB = createNode(
        "input",
        {
            locatorStrategy:
                "accessibilityId",

            locator:
                "username",

            text: "user",
        },
        {
            x: 250,
            y: 260,
        },
    );

    const edgeAB = createEdge(
        nodeA.id,
        nodeB.id,
    );

    const baselineNodes: FlowNode[] = [
        nodeA,
        nodeB,
    ];

    const baselineEdges: Edge[] = [
        edgeAB,
    ];

    it("reports added nodes and edges for a flow plan", () => {
        const plan: AIFlowPlan = {
            type: "flow_plan",

            summary: "Login flow",

            steps: [
                {
                    id: "s1",

                    action: "input",

                    title:
                        "Enter username",

                    description:
                        "Type username",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "username-field",

                    text: "user",
                },

                {
                    id: "s2",

                    action: "tap",

                    title:
                        "Tap login button",

                    description:
                        "Click login",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "login-button",
                },
            ],
        };

        const diff =
            computePlanDiff(
                {
                    kind: "flow",

                    plan,
                },
                baselineNodes,
                baselineEdges,
            );

        expect(
            diff.summary,
        ).toEqual({
            addedNodes: 2,

            modifiedNodes: 0,

            removedNodes: 0,

            addedEdges: 2,

            removedEdges: 0,
        });

        expect(
            diff.addedNodes.map(
                (change) =>
                    change.action,
            ),
        ).toEqual([
            "input",
            "tap",
        ]);

        expect(
            diff.addedNodes[0]
                .title,
        ).toBe(
            "Enter username",
        );
    });

    it("appends a single generated step to an existing flow", () => {
        const plan: AIFlowPlan = {
            type: "flow_plan",

            summary: "Single step",

            steps: [
                {
                    id: "s1",

                    action: "delay",

                    title:
                        "Wait briefly",

                    description:
                        "Pause",

                    duration: 500,
                },
            ],
        };

        const diff =
            computePlanDiff(
                {
                    kind: "flow",

                    plan,
                },
                baselineNodes,
                baselineEdges,
            );

        expect(
            diff.summary.addedNodes,
        ).toBe(1);

        expect(
            diff.addedNodes[0]
                .action,
        ).toBe("delay");

        expect(
            diff.summary
                .addedEdges,
        ).toBe(1);
    });

    it("reports a modified node when a modification plan updates locator", () => {
        const plan: ModificationPlan = {
            type: "modification_plan",

            summary: "Fix username locator",

            operation: {
                type: "updateNode",

                targetNodeId:
                    nodeB.id,

                step: {
                    action: "input",

                    locatorStrategy:
                        "id",

                    locator:
                        "username-input",
                },
            },
        };

        const diff =
            computePlanDiff(
                {
                    kind: "modification",

                    plan,
                },
                baselineNodes,
                baselineEdges,
            );

        expect(
            diff.summary.modifiedNodes,
        ).toBe(1);

        expect(
            diff.summary.addedNodes,
        ).toBe(0);

        const change =
            diff.modifiedNodes[0];

        expect(
            change.nodeId,
        ).toBe(nodeB.id);

        expect(
            change.fieldChanges?.some(
                (fieldChange) =>
                    fieldChange.field ===
                        "locator" &&
                    fieldChange.after ===
                        "username-input",
            ),
        ).toBe(true);

        expect(
            change.fieldChanges?.some(
                (fieldChange) =>
                    fieldChange.field ===
                        "locatorStrategy" &&
                    fieldChange.after ===
                        "id",
            ),
        ).toBe(true);
    });

    it("reports a removed node when a modification plan deletes a node", () => {
        const plan: ModificationPlan = {
            type: "modification_plan",

            summary: "Delete node",

            operation: {
                type: "deleteNode",

                targetNodeId:
                    nodeB.id,
            },
        };

        const diff =
            computePlanDiff(
                {
                    kind: "modification",

                    plan,
                },
                baselineNodes,
                baselineEdges,
            );

        expect(
            diff.summary.removedNodes,
        ).toBe(1);

        expect(
            diff.removedNodes[0]
                .nodeId,
        ).toBe(nodeB.id);

        expect(
            diff.summary
                .removedEdges,
        ).toBeGreaterThan(
            0,
        );
    });

    it("adds a node after a target and rewires edges", () => {
        const plan: ModificationPlan = {
            type: "modification_plan",

            summary: "Insert step",

            operation: {
                type: "addNodeAfter",

                targetNodeId:
                    nodeA.id,

                step: {
                    action: "tap",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "next-button",
                },
            },
        };

        const diff =
            computePlanDiff(
                {
                    kind: "modification",

                    plan,
                },
                baselineNodes,
                baselineEdges,
            );

        expect(
            diff.summary.addedNodes,
        ).toBe(1);

        expect(
            diff.addedNodes[0]
                .action,
        ).toBe("tap");

        expect(
            diff.summary
                .removedEdges,
        ).toBeGreaterThan(
            0,
        );

        expect(
            diff.summary.addedEdges,
        ).toBeGreaterThan(
            0,
        );
    });

    it("yields an empty diff when steps are unsupported by the applier", () => {
        const plan: AIFlowPlan = {
            type: "flow_plan",

            summary: "Unsupported",

            steps: [
                {
                    id: "s1",

                    action: "swipe",

                    title:
                        "Swipe up",

                    description:
                        "Scroll",

                    direction: "up",

                    distance: 100,

                    duration: 200,
                },
            ],
        };

        const diff =
            computePlanDiff(
                {
                    kind: "flow",

                    plan,
                },
                baselineNodes,
                baselineEdges,
            );

        expect(
            diff.summary.addedNodes,
        ).toBe(0);

        expect(
            diff.summary
                .modifiedNodes,
        ).toBe(0);

        expect(
            diff.summary
                .removedNodes,
        ).toBe(0);
    });
});
