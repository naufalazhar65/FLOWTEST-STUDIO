import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import type {
    ModificationPlanMultiple,
    ModificationPlanSingle,
} from "../types/ModificationPlan";

type MockNodeData = {
    action: string;

    title?: string;

    subtitle?: string;

    locatorStrategy?: string;

    locator?: string;

    timeout?: number;

    pollingInterval?: number;

    [key: string]: unknown;
};

type MockNode = {
    id: string;

    data: MockNodeData;
};

type MockFlowState = {
    nodes: MockNode[];

    edges: Array<{
        id: string;

        source: string;

        target: string;
    }>;

    runInHistoryBatch:
    ReturnType<typeof vi.fn>;

    updateNodeData:
    ReturnType<typeof vi.fn>;

    insertNodeWithData:
    ReturnType<typeof vi.fn>;

    removeNode:
    ReturnType<typeof vi.fn>;

    reset: () => void;
};

const flowState =
    vi.hoisted(
        () => {
            const createInitialNodes =
                (): MockNode[] => [
                    {
                        id:
                            "node-1",

                        data: {
                            action:
                                "tap",

                            title:
                                "Original Title",

                            subtitle:
                                "Original subtitle",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },
                    },
                ];

            const state: MockFlowState = {
                nodes:
                    createInitialNodes(),

                edges: [],

                runInHistoryBatch:
                    vi.fn(
                        (
                            callback,
                        ) =>
                            callback(),
                    ),

                updateNodeData:
                    vi.fn(
                        (
                            nodeId:
                                string,
                            patch:
                                Record<
                                    string,
                                    unknown
                                >,
                        ) => {
                            const node =
                                state.nodes.find(
                                    (
                                        item,
                                    ) =>
                                        item.id ===
                                        nodeId,
                                );

                            if (
                                node
                            ) {
                                node.data = {
                                    ...node.data,
                                    ...patch,
                                };
                            }
                        },
                    ),

                insertNodeWithData:
                    vi.fn(
                        (
                            _edgeId:
                                string | null,
                            action:
                                string,
                            data:
                                Record<
                                    string,
                                    unknown
                                >,
                            _afterNodeId?:
                                string,
                            _beforeNodeId?:
                                string,
                        ) => {
                            const newNode:
                                MockNode =
                            {
                                id:
                                    "created-node-1",

                                data: {
                                    action,

                                    ...data,
                                },
                            };

                            state.nodes.push(
                                newNode,
                            );
                        },
                    ),

                removeNode:
                    vi.fn(
                        (
                            nodeId:
                                string,
                        ) => {
                            state.nodes =
                                state.nodes.filter(
                                    (
                                        node,
                                    ) =>
                                        node.id !==
                                        nodeId,
                                );
                        },
                    ),

                reset:
                    () => {
                        state.nodes =
                            createInitialNodes();

                        state.edges =
                            [];
                    },
            };

            return state;
        },
    );

vi.mock(
    "../../flow/store/useFlowStore",
    () => ({
        useFlowStore: {
            getState:
                vi.fn(
                    () =>
                        flowState,
                ),
        },
    }),
);

import {
    applyModificationPlan,
} from "./applyModificationPlan";

describe(
    "applyModificationPlan",
    () => {
        beforeEach(
            () => {
                flowState.reset();

                flowState
                    .runInHistoryBatch
                    .mockClear();

                flowState
                    .updateNodeData
                    .mockClear();

                flowState
                    .insertNodeWithData
                    .mockClear();

                flowState
                    .removeNode
                    .mockClear();
            },
        );

        it(
            "exposes the generic modification plan API",
            () => {
                expect(
                    applyModificationPlan,
                ).toBeTypeOf(
                    "function",
                );
            },
        );

        it(
            "applies a generic updateNode operation",
            () => {
                const plan:
                    ModificationPlanSingle =
                {
                    type:
                        "modification_plan",

                    summary:
                        "Update node title",

                    operation: {
                        type:
                            "updateNode",

                        targetNodeId:
                            "node-1",

                        step: {
                            action:
                                "tap",

                            title:
                                "Updated by generic modification",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },
                    },
                };

                const result =
                    applyModificationPlan(
                        plan,
                    );

                expect(
                    result.success,
                ).toBe(
                    true,
                );

                expect(
                    result.appliedSteps,
                ).toBe(
                    1,
                );

                expect(
                    flowState
                        .updateNodeData,
                ).toHaveBeenCalledWith(
                    "node-1",
                    expect.objectContaining({
                        title:
                            "Updated by generic modification",
                    }),
                );

                expect(
                    flowState
                        .nodes[0]
                        .data.title,
                ).toBe(
                    "Updated by generic modification",
                );

                expect(
                    flowState
                        .runInHistoryBatch,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "applies a generic addNodeAfter operation",
            () => {
                const plan:
                    ModificationPlanSingle =
                {
                    type:
                        "modification_plan",

                    summary:
                        "Add wait node",

                    operation: {
                        type:
                            "addNodeAfter",

                        targetNodeId:
                            "node-1",

                        step: {
                            action:
                                "wait",

                            title:
                                "Wait Until Login",

                            description:
                                "Wait for Login.",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",

                            timeout:
                                5000,

                            pollingInterval:
                                250,
                        },
                    },
                };

                const result =
                    applyModificationPlan(
                        plan,
                    );

                expect(
                    result.success,
                ).toBe(
                    true,
                );

                expect(
                    result.appliedSteps,
                ).toBe(
                    1,
                );

                expect(
                    flowState.nodes,
                ).toHaveLength(
                    2,
                );

                const createdNode =
                    flowState.nodes.at(
                        -1,
                    );

                expect(
                    createdNode?.data
                        .action,
                ).toBe(
                    "wait",
                );

                expect(
                    createdNode?.data
                        .locator,
                ).toBe(
                    "Login",
                );

                expect(
                    createdNode?.data
                        .timeout,
                ).toBe(
                    5000,
                );

                expect(
                    createdNode?.data
                        .pollingInterval,
                ).toBe(
                    250,
                );

                expect(
                    flowState
                        .insertNodeWithData,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "applies a generic addNodeBefore operation",
            () => {
                const plan:
                    ModificationPlanSingle =
                {
                    type:
                        "modification_plan",

                    summary:
                        "Add wait node before",

                    operation: {
                        type:
                            "addNodeBefore",

                        targetNodeId:
                            "node-1",

                        step: {
                            action:
                                "wait",

                            title:
                                "Wait Before Login",

                            description:
                                "Wait before Login.",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",

                            timeout:
                                5000,

                            pollingInterval:
                                250,
                        },
                    },
                };

                const result =
                    applyModificationPlan(
                        plan,
                    );

                expect(
                    result.success,
                ).toBe(
                    true,
                );

                expect(
                    result.appliedSteps,
                ).toBe(
                    1,
                );

                expect(
                    flowState.nodes,
                ).toHaveLength(
                    2,
                );

                const createdNode =
                    flowState.nodes.at(
                        -1,
                    );

                expect(
                    createdNode?.data
                        .action,
                ).toBe(
                    "wait",
                );

                expect(
                    createdNode?.data
                        .locator,
                ).toBe(
                    "Login",
                );

                expect(
                    createdNode?.data
                        .timeout,
                ).toBe(
                    5000,
                );

                expect(
                    createdNode?.data
                        .pollingInterval,
                ).toBe(
                    250,
                );

                expect(
                    flowState
                        .insertNodeWithData,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "applies a generic deleteNode operation",
            () => {
                const plan:
                    ModificationPlanSingle =
                {
                    type:
                        "modification_plan",

                    summary:
                        "Delete node",

                    operation: {
                        type:
                            "deleteNode",

                        targetNodeId:
                            "node-1",
                    },
                };

                const result =
                    applyModificationPlan(
                        plan,
                    );

                expect(
                    result.success,
                ).toBe(
                    true,
                );

                expect(
                    result.appliedSteps,
                ).toBe(
                    1,
                );

                expect(
                    flowState.nodes,
                ).toHaveLength(
                    0,
                );

                expect(
                    flowState.removeNode,
                ).toHaveBeenCalledWith(
                    "node-1",
                );

                expect(
                    flowState
                        .runInHistoryBatch,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "applies multiple generic operations in order",
            () => {
                const plan: ModificationPlanMultiple = {
                    type:
                        "modification_plan",

                    summary:
                        "Apply multiple modifications",

                    operations: [
                        {
                            type:
                                "addNodeAfter",

                            targetNodeId:
                                "node-1",

                            resultId:
                                "wait-node",

                            step: {
                                action:
                                    "wait",

                                title:
                                    "Wait Before Login",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "Login",

                                timeout:
                                    5000,

                                pollingInterval:
                                    250,
                            },
                        },

                        {
                            type:
                                "updateNode",

                            targetNodeId:
                                "$wait-node",

                            step: {
                                action:
                                    "wait",

                                title:
                                    "Updated Wait",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "Login",

                                timeout:
                                    10000,

                                pollingInterval:
                                    500,
                            },
                        },
                    ],
                };

                const result =
                    applyModificationPlan(
                        plan,
                    );

                expect(
                    result.success,
                ).toBe(
                    true,
                );

                expect(
                    result.appliedSteps,
                ).toBe(
                    2,
                );

                expect(
                    flowState.nodes,
                ).toHaveLength(
                    2,
                );

                const createdNode =
                    flowState.nodes.at(
                        -1,
                    );

                expect(
                    createdNode?.data
                        .title,
                ).toBe(
                    "Updated Wait",
                );

                expect(
                    createdNode?.data
                        .timeout,
                ).toBe(
                    10000,
                );

                expect(
                    createdNode?.data
                        .pollingInterval,
                ).toBe(
                    500,
                );
            },
        );
    },
);