import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    applyAIModificationPlan,
} from "./applyAIModificationPlan";

describe(
    "applyAIModificationPlan",
    () => {
        beforeEach(() => {
            useFlowStore
                .getState()
                .resetFlow();
        });

        it(
            "applies a single addNodeAfter operation",
            () => {
                const result =
                    applyAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add wait after Login.",

                            operation: {
                                type:
                                    "addNodeAfter",

                                targetNodeId:
                                    "1",

                                step: {
                                    action:
                                        "wait",

                                    locatorStrategy:
                                        "accessibilityId",

                                    locator:
                                        "Login",

                                    timeout:
                                        1000,

                                    pollingInterval:
                                        500,
                                },
                            },
                        },
                    );

                expect(
                    result.success,
                ).toBe(true);

                expect(
                    result.appliedSteps,
                ).toBe(1);

                const state =
                    useFlowStore.getState();

                expect(
                    state.nodes,
                ).toHaveLength(4);

                const insertedNode =
                    state.nodes.find(
                        (node) =>
                            node.data
                                .action ===
                            "wait",
                    );

                expect(
                    insertedNode,
                ).toBeDefined();

                expect(
                    "locator" in
                        insertedNode!.data
                        ? insertedNode!.data
                            .locator
                        : undefined,
                ).toBe(
                    "Login",
                );
            },
        );

        it(
            "applies a single addNodeBefore operation",
            () => {
                const result =
                    applyAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add wait before Login.",

                            operation: {
                                type:
                                    "addNodeBefore",

                                targetNodeId:
                                    "3",

                                step: {
                                    action:
                                        "wait",

                                    title:
                                        "Wait Until Element",

                                    description:
                                        "Wait for Login before continuing.",

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
                        },
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

                const state =
                    useFlowStore.getState();

                const insertedNode =
                    state.nodes.find(
                        (
                            node,
                        ) =>
                            node.data
                                .action ===
                            "wait" &&
                            node.data
                                .locator ===
                            "Login",
                    );

                expect(
                    insertedNode,
                ).toBeDefined();

                expect(
                    insertedNode?.data
                        .action,
                ).toBe(
                    "wait",
                );

                if (
                    insertedNode?.data.action !==
                    "wait"
                ) {
                    throw new Error(
                        "Expected inserted node to be a wait node.",
                    );
                }

                expect(
                    insertedNode.data
                        .locatorStrategy,
                ).toBe(
                    "accessibilityId",
                );

                expect(
                    insertedNode.data.locator,
                ).toBe(
                    "Login",
                );

                const targetIndex =
                    state.nodes.findIndex(
                        (
                            node,
                        ) =>
                            node.id ===
                            "3",
                    );

                const insertedIndex =
                    state.nodes.findIndex(
                        (
                            node,
                        ) =>
                            node.id ===
                            insertedNode
                                ?.id,
                    );

                expect(
                    targetIndex,
                ).toBeGreaterThan(
                    insertedIndex,
                );
            },
        );

        it(
            "resolves resultId references between sequential operations",
            () => {
                const result =
                    applyAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add Get Text and Assert.",

                            operations: [
                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "1",

                                    resultId:
                                        "validationText",

                                    step: {
                                        action:
                                            "getText",

                                        locatorStrategy:
                                            "id",

                                        locator:
                                            "login",

                                        variableName:
                                            "actualText",
                                    },
                                },

                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "$validationText",

                                    step: {
                                        action:
                                            "assert",

                                        actual:
                                            "${actualText}",

                                        operator:
                                            "isNotEmpty",

                                        expected:
                                            "true",
                                    },
                                },
                            ],
                        },
                    );

                expect(
                    result.success,
                ).toBe(true);

                expect(
                    result.appliedSteps,
                ).toBe(2);

                const state =
                    useFlowStore.getState();

                expect(
                    state.nodes,
                ).toHaveLength(5);

                const getTextNode =
                    state.nodes.find(
                        (node) =>
                            node.data
                                .action ===
                            "getText",
                    );

                const assertNode =
                    state.nodes.find(
                        (node) =>
                            node.data.action ===
                            "assert" &&
                            "actual" in node.data &&
                            node.data.actual ===
                            "${actualText}",
                    );

                expect(
                    getTextNode,
                ).toBeDefined();

                expect(
                    assertNode,
                ).toBeDefined();

                expect(
                    "variableName" in
                        getTextNode!.data
                        ? getTextNode!.data
                            .variableName
                        : undefined,
                ).toBe(
                    "actualText",
                );

                expect(
                    "actual" in
                        assertNode!.data
                        ? assertNode!.data
                            .actual
                        : undefined,
                ).toBe(
                    "${actualText}",
                );

                const edgeToAssert =
                    state.edges.find(
                        (edge) =>
                            edge.source ===
                            getTextNode!.id &&
                            edge.target ===
                            assertNode!.id,
                    );

                expect(
                    edgeToAssert,
                ).toBeDefined();
            },
        );

        it(
            "keeps sequential operations inside one history batch",
            () => {
                const before =
                    useFlowStore.getState();

                const historyBefore =
                    before.history.length;

                const result =
                    applyAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add Get Text and Assert.",

                            operations: [
                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "1",

                                    resultId:
                                        "validationText",

                                    step: {
                                        action:
                                            "getText",

                                        locatorStrategy:
                                            "id",

                                        locator:
                                            "login",

                                        variableName:
                                            "actualText",
                                    },
                                },

                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "$validationText",

                                    step: {
                                        action:
                                            "assert",

                                        actual:
                                            "${actualText}",

                                        operator:
                                            "isNotEmpty",

                                        expected:
                                            "true",
                                    },
                                },
                            ],
                        },
                    );

                expect(
                    result.success,
                ).toBe(true);

                const after =
                    useFlowStore.getState();

                expect(
                    after.history.length,
                ).toBe(
                    historyBefore + 1,
                );
            },
        );

        it(
            "fails when a symbolic target cannot be resolved",
            () => {
                const result =
                    applyAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Invalid symbolic reference.",

                            operations: [
                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "1",

                                    resultId:
                                        "validationText",

                                    step: {
                                        action:
                                            "getText",

                                        locatorStrategy:
                                            "id",

                                        locator:
                                            "login",

                                        variableName:
                                            "actualText",
                                    },
                                },

                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "$missingResult",

                                    step: {
                                        action:
                                            "assert",

                                        actual:
                                            "${actualText}",

                                        operator:
                                            "isNotEmpty",

                                        expected:
                                            "true",
                                    },
                                },
                            ],
                        },
                    );

                expect(
                    result.success,
                ).toBe(false);

                expect(
                    result.error,
                ).toContain(
                    'target reference "$missingResult" does not refer to a previous operation result',
                );
            },
        );
    },
);