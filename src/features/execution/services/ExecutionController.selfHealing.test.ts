import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    ExecutionContext,
} from "../types/ExecutionContext";

import {
    useExecutionStore,
} from "../store/useExecutionStore";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    ExecutionController,
} from "./ExecutionController";

const mocks = vi.hoisted(
    () => ({
        deleteSession:
            vi.fn(),

        executeFlow:
            vi.fn(),
    }),
);

vi.mock(
    "../engine/executeFlow",
    () => ({
        executeFlow:
            mocks.executeFlow,
    }),
);

vi.mock(
    "../services/appium/AppiumClient",
    () => ({
        appiumClient: {
            deleteSession:
                mocks.deleteSession,
        },
    }),
);

describe(
    "ExecutionController self-healing integration",
    () => {
        beforeEach(
            () => {
                vi.clearAllMocks();

                mocks.deleteSession
                    .mockResolvedValue(
                        undefined,
                    );

                mocks.executeFlow
                    .mockResolvedValue(
                        undefined,
                    );

                useFlowStore
                    .getState()
                    .resetFlow();

                useExecutionStore
                    .getState()
                    .reset();

                /*
                 * Configure the initial tap node
                 * with a usable locator.
                 */
                useFlowStore
                    .getState()
                    .updateNodeData(
                        "1",
                        {
                            locatorStrategy:
                                "id",

                            locator:
                                "login",
                        },
                    );
            },
        );

        it(
            "applies a wait repair before retrying a failed action",
            async () => {
                const flowState =
                    useFlowStore
                        .getState();

                const targetNode =
                    flowState.nodes.find(
                        (
                            node,
                        ) =>
                            node.id ===
                            "1",
                    );

                expect(
                    targetNode,
                ).toBeDefined();

                if (
                    !targetNode
                ) {
                    throw new Error(
                        'Expected flow node "1" to exist.',
                    );
                }

                if (
                    targetNode.data
                        .action !==
                    "tap"
                ) {
                    throw new Error(
                        'Expected flow node "1" to be a tap node.',
                    );
                }

                const executionNodes:
                    FlowNode[] =
                    flowState.nodes;

                const executionContext:
                    ExecutionContext =
                {
                    edges:
                        flowState.edges,
                };

                /*
                 * First execution fails.
                 * Retry succeeds.
                 */
                mocks.executeFlow
                    .mockRejectedValueOnce(
                        new Error(
                            "Operation timed out",
                        ),
                    )
                    .mockResolvedValueOnce(
                        undefined,
                    );

                /*
                 * Seed the failure result.
                 * Do not call startExecution()
                 * because that sets status to
                 * "running".
                 */
                useExecutionStore
                    .getState()
                    .setNodeResult({
                        nodeId:
                            targetNode.id,

                        nodeType:
                            targetNode.data
                                .action,

                        nodeTitle:
                            targetNode.data
                                .title,

                        status:
                            "failed",

                        startedAt:
                            1000,

                        finishedAt:
                            1500,

                        duration:
                            500,

                        error:
                            "Operation timed out",
                    });

                const initialNodeCount =
                    useFlowStore
                        .getState()
                        .nodes.length;

                await ExecutionController.run(
                    executionNodes,
                    executionContext,
                );

                /*
                 * Initial execution +
                 * one self-healing retry.
                 */
                expect(
                    mocks.executeFlow,
                ).toHaveBeenCalledTimes(
                    2,
                );

                expect(
                    mocks.executeFlow,
                ).toHaveBeenNthCalledWith(
                    1,
                    executionNodes,
                    expect.objectContaining({
                        edges:
                            executionContext.edges,

                        retry: {
                            enabled:
                                false,

                            maxAttempts:
                                2,

                            retryDelayMs:
                                500,
                        },
                    }),
                );

                const secondCall =
                    mocks.executeFlow.mock.calls[1];

                expect(
                    secondCall,
                ).toBeDefined();

                const rerunNodes =
                    secondCall?.[0];

                const rerunContext =
                    secondCall?.[1];

                expect(
                    rerunNodes,
                ).toHaveLength(
                    initialNodeCount + 1,
                );

                expect(
                    rerunNodes?.some(
                        (node: FlowNode) =>
                            node.data.action ===
                            "wait",
                    ),
                ).toBe(
                    true,
                );

                expect(
                    rerunNodes?.some(
                        (node: FlowNode) =>
                            node.data.action ===
                            "wait" &&
                            "locator" in
                            node.data &&
                            node.data.locator ===
                            "login",
                    ),
                ).toBe(
                    true,
                );

                expect(
                    rerunNodes?.some(
                        (node: FlowNode) =>
                            node.data.action ===
                            "wait" &&
                            "timeout" in
                            node.data &&
                            node.data.timeout ===
                            10000 &&
                            "pollingInterval" in
                            node.data &&
                            node.data
                                .pollingInterval ===
                            500,
                    ),
                ).toBe(
                    true,
                );

                expect(
                    rerunContext?.edges,
                ).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            source:
                                expect.any(
                                    String,
                                ),

                            target:
                                "1",
                        }),
                    ]),
                );

                /*
                 * Fresh Appium session for
                 * both attempts.
                 */
                expect(
                    mocks.deleteSession,
                ).toHaveBeenCalledTimes(
                    2,
                );

                /*
                 * Verify that the real
                 * modification engine inserted
                 * a wait node.
                 */
                const after =
                    useFlowStore
                        .getState();

                expect(
                    after.nodes.length,
                ).toBe(
                    initialNodeCount +
                    1,
                );

                const waitNode =
                    after.nodes.find(
                        (
                            node,
                        ) =>
                            node.data
                                .action ===
                            "wait" &&
                            "locator" in
                            node.data &&
                            node.data
                                .locator ===
                            "login",
                    );

                expect(
                    waitNode,
                ).toBeDefined();

                if (
                    !waitNode
                ) {
                    throw new Error(
                        "Expected self-healing wait node.",
                    );
                }

                if (
                    waitNode.data.action !==
                    "wait"
                ) {
                    throw new Error(
                        "Expected self-healing node to be a wait node.",
                    );
                }

                expect(
                    waitNode.data
                        .locatorStrategy,
                ).toBe(
                    "id",
                );

                expect(
                    waitNode.data
                        .locator,
                ).toBe(
                    "login",
                );

                expect(
                    waitNode.data
                        .timeout,
                ).toBe(
                    10000,
                );

                expect(
                    waitNode.data
                        .pollingInterval,
                ).toBe(
                    500,
                );

                /*
                 * The wait node must be inserted
                 * before the failed target node.
                 */
                const waitToTargetEdge =
                    after.edges.find(
                        (edge) =>
                            edge.source ===
                            waitNode.id &&
                            edge.target ===
                            "1",
                    );

                expect(
                    waitToTargetEdge,
                ).toBeDefined();

                if (
                    !waitToTargetEdge
                ) {
                    throw new Error(
                        "Expected self-healing wait node to connect to the failed target node.",
                    );
                }
            },
        );

        it(
            "does not modify the flow when the initial execution succeeds",
            async () => {
                const flowState =
                    useFlowStore
                        .getState();

                const executionNodes:
                    FlowNode[] =
                    flowState.nodes;

                const executionContext:
                    ExecutionContext =
                {
                    edges:
                        flowState.edges,
                };

                const beforeNodes =
                    structuredClone(
                        flowState.nodes,
                    );

                mocks.executeFlow
                    .mockResolvedValue(
                        undefined,
                    );

                await ExecutionController.run(
                    executionNodes,
                    executionContext,
                );

                const after =
                    useFlowStore
                        .getState();

                expect(
                    mocks.executeFlow,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    after.nodes,
                ).toEqual(
                    beforeNodes,
                );

                expect(
                    mocks.deleteSession,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );
    },
);