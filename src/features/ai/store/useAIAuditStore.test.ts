import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    createNode,
} from "../../flow/factories/nodeFactory";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    useAIAuditStore,
} from "./useAIAuditStore";

import type {
    AIFlowPlan,
} from "../types/AIFlowPlan";

import type {
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

function setFlowNodes(
    nodes: ReturnType<
        typeof createNode
    >[],
) {
    useFlowStore.setState({
        nodes,
    });
}

describe("useAIAuditStore", () => {
    beforeEach(() => {
        useAIAuditStore.setState({
            records: [],
        });

        useFlowStore.setState({
            nodes: [],

            edges: [],

            history: [],

            future: [],
        });
    });

    it("records a flow plan with a projected diff on an empty flow", () => {
        const plan: AIFlowPlan = {
            type: "flow_plan",

            summary: "Login flow",

            steps: [
                {
                    id: "s1",

                    action: "tap",

                    title: "Login",

                    description:
                        "Tap login",

                    locatorStrategy:
                        "accessibilityId",

                    locator: "login",
                },
            ],
        };

        useAIAuditStore
            .getState()
            .recordAppliedPlan({
                kind: "flow",

                plan,
            });

        const records =
            useAIAuditStore
                .getState()
                .records;

        expect(
            records.length,
        ).toBe(1);

        const record =
            records[0];

        expect(
            record.kind,
        ).toBe("flow");

        expect(
            record.summary,
        ).toBe("Login flow");

        expect(
            record.status,
        ).toBe("applied");

        expect(
            record.diff.summary
                .addedNodes,
        ).toBe(1);
    });

    it("records a modification plan diff for an existing node", () => {
        const node = createNode(
            "input",
            {
                locatorStrategy:
                    "accessibilityId",

                locator: "user",

                text: "old",
            },
        );

        setFlowNodes([
            node,
        ]);

        const plan: ModificationPlan = {
            type: "modification_plan",

            summary: "Fix locator",

            operation: {
                type: "updateNode",

                targetNodeId:
                    node.id,

                step: {
                    action: "input",

                    locator: "newUser",
                },
            },
        };

        useAIAuditStore
            .getState()
            .recordAppliedPlan({
                kind: "modification",

                plan,
            });

        const record =
            useAIAuditStore
                .getState()
                .records[0];

        expect(
            record.kind,
        ).toBe("modification");

        expect(
            record.diff.summary
                .modifiedNodes,
        ).toBe(1);
    });

    it("rolls back a modification and marks the record rolledBack", () => {
        const node = createNode(
            "input",
            {
                locatorStrategy:
                    "accessibilityId",

                locator: "user",

                text: "alice",
            },
        );

        setFlowNodes([
            node,
        ]);

        const plan: ModificationPlan = {
            type: "modification_plan",

            summary: "Change value",

            operation: {
                type: "updateNode",

                targetNodeId:
                    node.id,

                step: {
                    action: "input",

                    text: "bob",
                },
            },
        };

        useAIAuditStore
            .getState()
            .recordAppliedPlan({
                kind: "modification",

                plan,
            });

        const record =
            useAIAuditStore
                .getState()
                .records[0];

        useFlowStore
            .getState()
            .updateNodeData(
                node.id,
                {
                    text: "bob",
                },
            );

        expect(
            (
                useFlowStore
                    .getState()
                    .nodes[0].data as {
                        text: string;
                    }
            ).text,
        ).toBe("bob");

        useAIAuditStore
            .getState()
            .rollback(
                record.id,
            );

        expect(
            (
                useFlowStore
                    .getState()
                    .nodes[0].data as {
                        text: string;
                    }
            ).text,
        ).toBe("alice");

        expect(
            useAIAuditStore
                .getState()
                .records[0].status,
        ).toBe("rolledBack");
    });

    it("does not roll back a record that was already rolled back", () => {
        const node = createNode(
            "launchApp",
        );

        setFlowNodes([
            node,
        ]);

        const plan: ModificationPlan = {
            type: "modification_plan",

            summary: "Delete node",

            operation: {
                type: "deleteNode",

                targetNodeId:
                    node.id,
            },
        };

        const store =
            useAIAuditStore
                .getState();

        store.recordAppliedPlan({
            kind: "modification",

            plan,
        });

        const record =
            useAIAuditStore
                .getState()
                .records[0];

        useAIAuditStore
            .getState()
            .rollback(
                record.id,
            );

        expect(
            useAIAuditStore
                .getState()
                .records[0].status,
        ).toBe("rolledBack");

        useFlowStore
            .getState()
            .removeNode(
                node.id,
            );

        expect(
            useFlowStore
                .getState()
                .nodes.length,
        ).toBe(0);

        useAIAuditStore
            .getState()
            .rollback(
                record.id,
            );

        expect(
            useFlowStore
                .getState()
                .nodes.length,
        ).toBe(0);
    });

    it("clearHistory empties the records list", () => {
        const plan: AIFlowPlan = {
            type: "flow_plan",

            summary: "Demo",

            steps: [],
        };

        useAIAuditStore
            .getState()
            .recordAppliedPlan({
                kind: "flow",

                plan,
            });

        expect(
            useAIAuditStore
                .getState()
                .records.length,
        ).toBe(1);

        useAIAuditStore
            .getState()
            .clearHistory();

        expect(
            useAIAuditStore
                .getState()
                .records.length,
        ).toBe(0);
    });

    it("records are prepended, newest first", () => {
        useAIAuditStore
            .getState()
            .recordAppliedPlan({
                kind: "flow",

                plan: {
                    type: "flow_plan",

                    summary: "First",

                    steps: [],
                },
            });

        useAIAuditStore
            .getState()
            .recordAppliedPlan({
                kind: "flow",

                plan: {
                    type: "flow_plan",

                    summary: "Second",

                    steps: [],
                },
            });

        const summaries =
            useAIAuditStore
                .getState()
                .records.map(
                    (
                        record,
                    ) =>
                        record.summary,
                );

        expect(
            summaries,
        ).toEqual([
            "Second",
            "First",
        ]);
    });
});
