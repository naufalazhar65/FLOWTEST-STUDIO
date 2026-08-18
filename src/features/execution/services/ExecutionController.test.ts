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

const mocks = vi.hoisted(
    () => ({

        buildApplicationStateRecoveryPlan:
            vi.fn(),

        executeRecoveryPath:
            vi.fn(),
        recoverApplicationState:
            vi.fn(),
        executeNode:
            vi.fn(),
        deleteSession:
            vi.fn(),

        pauseExecution:
            vi.fn(),

        resumeExecution:
            vi.fn(),

        stopExecution:
            vi.fn(),

        analyzeExecutionFailure:
            vi.fn(),

        buildSelfHealingPlan:
            vi.fn(),

        executeSelfHealing:
            vi.fn(),

        applyAIModificationPlan:
            vi.fn(),
    }),
);

const executionState =
    vi.hoisted(
        () => ({
            status:
                "idle" as const,

            nodeResults:
                {} as Record<
                    string,
                    unknown
                >,
        }),
    );

const flowState =
    vi.hoisted(
        () => ({
            nodes:
                [] as FlowNode[],

            edges:
                [] as ExecutionContext[
                "edges"
                ],
        }),
    );

vi.mock(
    "../engine/executeFlow",
    () => ({
        executeFlow:
            vi.fn(),
    }),
);

vi.mock(
    "../services/appium/recoverApplicationState",
    () => ({
        recoverApplicationState:
            mocks.recoverApplicationState,
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

vi.mock(
    "../store/useExecutionStore",
    () => ({
        useExecutionStore: {
            getState:
                vi.fn(
                    () => ({
                        status:
                            executionState.status,

                        nodeResults:
                            executionState.nodeResults,

                        pauseExecution:
                            mocks.pauseExecution,

                        resumeExecution:
                            mocks.resumeExecution,

                        stopExecution:
                            mocks.stopExecution,
                    }),
                ),
        },
    }),
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

vi.mock(
    "./analyzeExecutionFailure",
    () => ({
        analyzeExecutionFailure:
            mocks.analyzeExecutionFailure,
    }),
);

vi.mock(
    "./buildSelfHealingPlan",
    () => ({
        buildSelfHealingPlan:
            mocks.buildSelfHealingPlan,
    }),
);

vi.mock(
    "./executeSelfHealing",
    () => ({
        executeSelfHealing:
            mocks.executeSelfHealing,
    }),
);

vi.mock(
    "../../ai/services/applyAIModificationPlan",
    () => ({
        applyAIModificationPlan:
            mocks.applyAIModificationPlan,
    }),
);

vi.mock(
    "./buildApplicationStateRecoveryPlan",
    () => ({
        buildApplicationStateRecoveryPlan:
            mocks.buildApplicationStateRecoveryPlan,
    }),
);

vi.mock(
    "../engine/executeRecoveryPath",
    () => ({
        executeRecoveryPath:
            mocks.executeRecoveryPath,
    }),
);

vi.mock(
    "../engine/executeNode",
    () => ({
        executeNode:
            mocks.executeNode,
    }),
);

import {
    buildApplicationStateRecoveryPlan,
} from "./buildApplicationStateRecoveryPlan";

import {
    executeRecoveryPath,
} from "../engine/executeRecoveryPath";

import {
    executeNode,
} from "../engine/executeNode";

import {
    executeFlow,
} from "../engine/executeFlow";

import {
    ExecutionController,
} from "./ExecutionController";

const executeFlowMock =
    vi.mocked(
        executeFlow,
    );

const buildApplicationStateRecoveryPlanMock =
    vi.mocked(
        buildApplicationStateRecoveryPlan,
    );

const executeRecoveryPathMock =
    vi.mocked(
        executeRecoveryPath,
    );

const executeNodeMock =
    vi.mocked(
        executeNode,
    );

const nodes:
    FlowNode[] = [
        {
            id:
                "node-1",

            type:
                "default",

            position: {
                x: 0,

                y: 0,
            },

            data: {
                action:
                    "tap",

                title:
                    "Tap",

                subtitle:
                    "",

                debug: {
                    breakpoint:
                        false,
                },

                locatorStrategy:
                    "id",

                locator:
                    "login",
            },
        } as FlowNode,
    ];

const context:
    ExecutionContext = {
    edges: [],
};

describe(
    "ExecutionController",
    () => {
        beforeEach(() => {
            vi.resetAllMocks();

            buildApplicationStateRecoveryPlanMock
                .mockReturnValue([]);

            executeRecoveryPathMock
                .mockResolvedValue(undefined);

            executionState.status =
                "idle";

            executionState.nodeResults =
                {};

            flowState.nodes =
                structuredClone(
                    nodes,
                );

            flowState.edges =
                structuredClone(
                    context.edges,
                );

            mocks.deleteSession
                .mockResolvedValue(
                    undefined,
                );

            executeFlowMock
                .mockResolvedValue(
                    undefined,
                );

            mocks.analyzeExecutionFailure
                .mockReturnValue(
                    null,
                );

            mocks.buildSelfHealingPlan
                .mockReturnValue(
                    {
                        canAutoApply:
                            false,

                        strategy:
                            "none",

                        confidence:
                            "low",

                        reason:
                            "No self-healing strategy.",

                        modificationPlan:
                            null,

                        targetNodeId:
                            null,
                    },
                );

            mocks.applyAIModificationPlan
                .mockReturnValue(
                    {
                        success:
                            true,

                        appliedSteps:
                            1,
                    },
                );

            mocks.executeSelfHealing
                .mockResolvedValue(
                    {
                        status:
                            "skipped",

                        attempted:
                            false,

                        rerunAttempted:
                            false,

                        rerunSucceeded:
                            false,

                        healingAttempts:
                            0,

                        error:
                            null,
                    },
                );
        });

        describe(
            "run",
            () => {
                it(
                    "deletes the existing Appium session before executing the flow",
                    async () => {
                        await ExecutionController.run(
                            nodes,
                            context,
                        );

                        expect(
                            mocks.deleteSession,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledWith(
                            nodes,
                            context,
                        );
                    },
                );

                it(
                    "deletes the Appium session before executing the flow",
                    async () => {
                        const executionOrder:
                            string[] =
                            [];

                        mocks.deleteSession.mockImplementation(
                            async () => {
                                executionOrder.push(
                                    "deleteSession",
                                );
                            },
                        );

                        executeFlowMock.mockImplementation(
                            async () => {
                                executionOrder.push(
                                    "executeFlow",
                                );
                            },
                        );

                        await ExecutionController.run(
                            nodes,
                            context,
                        );

                        expect(
                            executionOrder,
                        ).toEqual([
                            "deleteSession",
                            "executeFlow",
                        ]);
                    },
                );

                it(
                    "passes nodes and context to executeFlow",
                    async () => {
                        const customContext:
                            ExecutionContext =
                        {
                            edges: [
                                {
                                    id:
                                        "edge-1",

                                    source:
                                        "node-1",

                                    target:
                                        "node-2",
                                },
                            ],
                        };

                        await ExecutionController.run(
                            nodes,
                            customContext,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledWith(
                            nodes,
                            customContext,
                        );
                    },
                );

                it(
                    "does not execute the flow when Appium session deletion fails",
                    async () => {
                        mocks.deleteSession
                            .mockRejectedValue(
                                new Error(
                                    "Failed to delete Appium session",
                                ),
                            );

                        await expect(
                            ExecutionController.run(
                                nodes,
                                context,
                            ),
                        ).rejects.toThrow(
                            "Failed to delete Appium session",
                        );

                        expect(
                            executeFlowMock,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.analyzeExecutionFailure,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.executeSelfHealing,
                        ).not.toHaveBeenCalled();
                    },
                );

                it(
                    "propagates flow execution errors when no failure analysis is available",
                    async () => {
                        executionState.nodeResults =
                        {
                            "node-1":
                            {
                                nodeId:
                                    "node-1",

                                nodeType:
                                    "tap",

                                nodeTitle:
                                    "Tap",

                                status:
                                    "failed",

                                startedAt:
                                    1000,

                                finishedAt:
                                    1500,

                                duration:
                                    500,

                                error:
                                    "Flow execution failed",
                            },
                        };

                        mocks.analyzeExecutionFailure
                            .mockReturnValue(
                                null,
                            );

                        executeFlowMock
                            .mockRejectedValue(
                                new Error(
                                    "Flow execution failed",
                                ),
                            );

                        await expect(
                            ExecutionController.run(
                                nodes,
                                context,
                            ),
                        ).rejects.toThrow(
                            "Flow execution failed",
                        );

                        expect(
                            mocks.deleteSession,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.analyzeExecutionFailure,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.buildSelfHealingPlan,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.executeSelfHealing,
                        ).not.toHaveBeenCalled();
                    },
                );

                it(
                    "propagates the original error when self-healing is not available",
                    async () => {
                        const failureAnalysis =
                        {
                            context:
                                {},

                            classification:
                                {},

                            rootCause:
                                {},

                            suggestedFix:
                                {},
                        };

                        executionState.nodeResults =
                        {
                            "node-1":
                            {
                                nodeId:
                                    "node-1",

                                nodeType:
                                    "tap",

                                nodeTitle:
                                    "Tap",

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
                            },
                        };

                        flowState.nodes = [
                            {
                                id:
                                    "launch-node",

                                type:
                                    "flow",

                                position: {
                                    x: 0,

                                    y: 0,
                                },

                                data: {
                                    action:
                                        "launchApp",

                                    title:
                                        "Launch App",

                                    subtitle:
                                        "Launch application",

                                    platform:
                                        "iOS",

                                    appPackage:
                                        "",

                                    appActivity:
                                        "",

                                    bundleId:
                                        "com.demo.ios",

                                    app:
                                        "",

                                    noReset:
                                        false,

                                    debug: {
                                        breakpoint:
                                            false,
                                    },
                                },
                            } as FlowNode,
                        ];

                        flowState.edges = [];

                        mocks.analyzeExecutionFailure
                            .mockReturnValue(
                                failureAnalysis,
                            );



                        mocks.buildSelfHealingPlan
                            .mockReturnValue(
                                {
                                    canAutoApply:
                                        false,

                                    strategy:
                                        "manual",

                                    confidence:
                                        "medium",

                                    reason:
                                        "Manual review required.",

                                    modificationPlan:
                                        null,

                                    targetNodeId:
                                        "node-1",
                                },
                            );

                        executeFlowMock
                            .mockRejectedValue(
                                new Error(
                                    "Operation timed out",
                                ),
                            );

                        await expect(
                            ExecutionController.run(
                                nodes,
                                context,
                            ),
                        ).rejects.toThrow(
                            "Operation timed out",
                        );

                        expect(
                            mocks.analyzeExecutionFailure,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.buildSelfHealingPlan,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.executeSelfHealing,
                        ).not.toHaveBeenCalled();
                    },
                );

                it(
                    "applies self-healing and reruns the flow once",
                    async () => {
                        const failureAnalysis =
                        {
                            context:
                                {},

                            classification:
                                {},

                            rootCause:
                                {},

                            suggestedFix:
                            {
                                type:
                                    "addWait",
                            },
                        };

                        const modificationPlan =
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add synchronization.",

                            operation:
                            {
                                type:
                                    "addNodeBefore",

                                targetNodeId:
                                    "node-1",

                                step:
                                {
                                    action:
                                        "wait",

                                    title:
                                        "Wait Until Element",

                                    description:
                                        "Wait for target.",

                                    locatorStrategy:
                                        "id",

                                    locator:
                                        "login",

                                    timeout:
                                        10000,

                                    pollingInterval:
                                        500,
                                },
                            },
                        };

                        executionState.nodeResults =
                        {
                            "node-1":
                            {
                                nodeId:
                                    "node-1",

                                nodeType:
                                    "tap",

                                nodeTitle:
                                    "Tap",

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
                            },
                        };

                        mocks.analyzeExecutionFailure
                            .mockReturnValue(
                                failureAnalysis,
                            );

                        mocks.buildSelfHealingPlan
                            .mockReturnValue(
                                {
                                    canAutoApply:
                                        true,

                                    strategy:
                                        "modification",

                                    confidence:
                                        "high",

                                    reason:
                                        "Deterministic repair plan is available.",

                                    modificationPlan:
                                        modificationPlan,

                                    targetNodeId:
                                        "node-1",
                                },
                            );

                        mocks.executeSelfHealing
                            .mockImplementation(
                                async (
                                    _plan,
                                    options,
                                ) => {
                                    const applyResult =
                                        await options.applyModificationPlan(
                                            modificationPlan,
                                        );

                                    if (
                                        !applyResult.success
                                    ) {
                                        return {
                                            status:
                                                "failed",

                                            attempted:
                                                true,

                                            rerunAttempted:
                                                false,

                                            rerunSucceeded:
                                                false,

                                            healingAttempts:
                                                1,

                                            error:
                                                applyResult.error ??
                                                "Apply failed.",
                                        };
                                    }

                                    const rerunSucceeded =
                                        await options.rerun();

                                    return {
                                        status:
                                            rerunSucceeded
                                                ? "applied"
                                                : "failed",

                                        attempted:
                                            true,

                                        rerunAttempted:
                                            true,

                                        rerunSucceeded,

                                        healingAttempts:
                                            1,

                                        error:
                                            rerunSucceeded
                                                ? null
                                                : "Rerun failed.",
                                    };
                                },
                            );

                        executeFlowMock
                            .mockRejectedValueOnce(
                                new Error(
                                    "Operation timed out",
                                ),
                            )
                            .mockResolvedValueOnce(
                                undefined,
                            );

                        await ExecutionController.run(
                            nodes,
                            context,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledTimes(
                            2,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenNthCalledWith(
                            1,
                            nodes,
                            context,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenNthCalledWith(
                            2,
                            nodes,
                            context,
                        );

                        expect(
                            mocks.analyzeExecutionFailure,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.buildSelfHealingPlan,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.executeSelfHealing,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.applyAIModificationPlan,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.deleteSession,
                        ).toHaveBeenCalledTimes(
                            2,
                        );
                    },
                );

                it(
                    "reruns using the latest flow after self-healing",
                    async () => {
                        const originalNodes =
                            structuredClone(
                                nodes,
                            );

                        const originalEdges =
                            structuredClone(
                                context.edges,
                            );

                        const repairedNode =
                        {
                            ...originalNodes[0],
                            id:
                                "repair-node",
                        };

                        const repairedNodes = [
                            ...originalNodes,
                            repairedNode,
                        ];

                        const failureAnalysis =
                        {
                            context: {},

                            classification: {},

                            rootCause: {},

                            suggestedFix: {
                                type:
                                    "addWait",
                            },
                        };

                        mocks.analyzeExecutionFailure
                            .mockReturnValue(
                                failureAnalysis,
                            );

                        mocks.buildSelfHealingPlan
                            .mockReturnValue(
                                {
                                    canAutoApply:
                                        true,

                                    strategy:
                                        "modification",

                                    confidence:
                                        "high",

                                    reason:
                                        "Deterministic repair plan is available.",

                                    modificationPlan:
                                    {
                                        type:
                                            "modification_plan",

                                        summary:
                                            "Add synchronization.",

                                        operation:
                                        {
                                            type:
                                                "addNodeBefore",

                                            targetNodeId:
                                                "node-1",

                                            step:
                                            {
                                                action:
                                                    "wait",

                                                title:
                                                    "Wait Until Element",

                                                description:
                                                    "Wait for target.",

                                                locatorStrategy:
                                                    "id",

                                                locator:
                                                    "login",

                                                timeout:
                                                    10000,

                                                pollingInterval:
                                                    500,
                                            },
                                        },
                                    },

                                    targetNodeId:
                                        "node-1",
                                },
                            );

                        executeFlowMock
                            .mockRejectedValueOnce(
                                new Error(
                                    "Operation timed out",
                                ),
                            )
                            .mockResolvedValueOnce(
                                undefined,
                            );

                        mocks.executeSelfHealing
                            .mockImplementation(
                                async (
                                    _plan,
                                    options,
                                ) => {
                                    const applyResult =
                                        await options.applyModificationPlan(
                                            _plan.modificationPlan,
                                        );

                                    expect(
                                        applyResult.success,
                                    ).toBe(
                                        true,
                                    );

                                    /*
                                     * Simulate the flow store
                                     * after the repair has been applied.
                                     */
                                    flowState.nodes =
                                        repairedNodes;

                                    flowState.edges =
                                        originalEdges;

                                    const rerunSucceeded =
                                        await options.rerun();

                                    return {
                                        status:
                                            rerunSucceeded
                                                ? "applied"
                                                : "failed",

                                        attempted:
                                            true,

                                        rerunAttempted:
                                            true,

                                        rerunSucceeded,

                                        healingAttempts:
                                            1,

                                        error:
                                            rerunSucceeded
                                                ? null
                                                : "Rerun failed.",
                                    };
                                },
                            );

                        await ExecutionController.run(
                            originalNodes,
                            {
                                edges:
                                    originalEdges,
                            },
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledTimes(
                            2,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenNthCalledWith(
                            1,
                            originalNodes,
                            {
                                edges:
                                    originalEdges,
                            },
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenNthCalledWith(
                            2,
                            repairedNodes,
                            {
                                edges:
                                    originalEdges,
                            },
                        );
                    },
                );

                it(
                    "propagates a combined error when self-healing and rerun fail",
                    async () => {
                        const failureAnalysis =
                        {
                            context:
                                {},

                            classification:
                                {},

                            rootCause:
                                {},

                            suggestedFix:
                            {
                                type:
                                    "addWait",
                            },
                        };

                        const modificationPlan =
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add synchronization.",

                            operation:
                            {
                                type:
                                    "addNodeBefore",

                                targetNodeId:
                                    "node-1",

                                step:
                                {
                                    action:
                                        "wait",

                                    title:
                                        "Wait Until Element",

                                    description:
                                        "Wait for target.",

                                    locatorStrategy:
                                        "id",

                                    locator:
                                        "login",

                                    timeout:
                                        10000,

                                    pollingInterval:
                                        500,
                                },
                            },
                        };

                        executionState.nodeResults =
                        {
                            "node-1":
                            {
                                nodeId:
                                    "node-1",

                                nodeType:
                                    "tap",

                                nodeTitle:
                                    "Tap",

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
                            },
                        };

                        mocks.analyzeExecutionFailure
                            .mockReturnValue(
                                failureAnalysis,
                            );

                        mocks.buildSelfHealingPlan
                            .mockReturnValue(
                                {
                                    canAutoApply:
                                        true,

                                    strategy:
                                        "modification",

                                    confidence:
                                        "high",

                                    reason:
                                        "Deterministic repair plan is available.",

                                    modificationPlan:
                                        modificationPlan,

                                    targetNodeId:
                                        "node-1",
                                },
                            );

                        mocks.executeSelfHealing
                            .mockResolvedValue(
                                {
                                    status:
                                        "failed",

                                    attempted:
                                        true,

                                    rerunAttempted:
                                        true,

                                    rerunSucceeded:
                                        false,

                                    healingAttempts:
                                        1,

                                    error:
                                        "Rerun still failed.",
                                },
                            );

                        executeFlowMock
                            .mockRejectedValue(
                                new Error(
                                    "Operation timed out",
                                ),
                            );

                        await expect(
                            ExecutionController.run(
                                nodes,
                                context,
                            ),
                        ).rejects.toThrow(
                            "Self-healing failed: Rerun still failed.",
                        );

                        expect(
                            mocks.executeSelfHealing,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.deleteSession,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );

                it(
                    "executes runtime recovery before rerunning the flow",
                    async () => {
                        const failureAnalysis =
                        {
                            context: {
                                node: {
                                    id:
                                        "node-1",
                                },
                            },

                            classification: {
                                category:
                                    "applicationStateError",
                            },

                            rootCause: {
                                category:
                                    "wrongApplicationState",
                            },

                            suggestedFix: {
                                type:
                                    "restoreApplicationState",
                            },
                        };

                        const recoveryPath = [
                            {
                                id:
                                    "recovery-node-1",

                                type:
                                    "default",

                                position: {
                                    x: 0,

                                    y: 0,
                                },

                                data: {
                                    action:
                                        "tap",

                                    title:
                                        "Tap Recovery",

                                    subtitle:
                                        "Restore application state",

                                    debug: {
                                        breakpoint:
                                            false,
                                    },

                                    locatorStrategy:
                                        "id",

                                    locator:
                                        "recovery",
                                },
                            } as FlowNode,
                        ];

                        executionState.nodeResults =
                        {
                            "node-1": {
                                nodeId:
                                    "node-1",

                                nodeType:
                                    "tap",

                                nodeTitle:
                                    "Tap",

                                status:
                                    "failed",

                                startedAt:
                                    1000,

                                finishedAt:
                                    1500,

                                duration:
                                    500,

                                error:
                                    "Application is in an unexpected state.",
                            },
                        };

                        mocks.analyzeExecutionFailure
                            .mockReturnValue(
                                failureAnalysis,
                            );

                        mocks.buildSelfHealingPlan
                            .mockReturnValue(
                                {
                                    canAutoApply:
                                        true,

                                    strategy:
                                        "runtimeRecovery",

                                    confidence:
                                        "high",

                                    reason:
                                        "Deterministic runtime recovery plan is available.",

                                    modificationPlan:
                                        null,

                                    targetNodeId:
                                        "node-1",
                                },
                            );

                        buildApplicationStateRecoveryPlanMock
                            .mockReturnValue(
                                recoveryPath,
                            );

                        flowState.nodes = [
                            {
                                id:
                                    "launch-node",

                                type:
                                    "flow",

                                position: {
                                    x: 0,

                                    y: 0,
                                },

                                data: {
                                    action:
                                        "launchApp",

                                    title:
                                        "Launch App",

                                    subtitle:
                                        "Launch application",

                                    platform:
                                        "iOS",

                                    appPackage:
                                        "",

                                    appActivity:
                                        "",

                                    bundleId:
                                        "com.demo.ios",

                                    app:
                                        "",

                                    noReset:
                                        false,

                                    debug: {
                                        breakpoint:
                                            false,
                                    },
                                },
                            } as FlowNode,
                        ];

                        flowState.edges = [];

                        

                        executeNodeMock
                            .mockResolvedValue({
                                outputs: [
                                    "next",
                                ],
                            });

                        mocks.executeSelfHealing
                            .mockImplementation(
                                async (
                                    plan,
                                    options,
                                ) => {
                                    expect(
                                        plan.strategy,
                                    ).toBe(
                                        "runtimeRecovery",
                                    );

                                    const recoveryResult =
                                        await options.executeRecovery?.();

                                    expect(
                                        recoveryResult
                                            ?.success,
                                    ).toBe(
                                        true,
                                    );

                                

                                    const rerunSucceeded =
                                        await options.rerun();

                                    expect(
                                        executeNodeMock,
                                    ).toHaveBeenCalledTimes(
                                        1,
                                    );

                                    expect(
                                        executeNodeMock,
                                    ).toHaveBeenCalledWith(
                                        expect.objectContaining({
                                            id:
                                                "node-1",
                                        }),
                                        expect.objectContaining({
                                            edges: [],
                                        }),
                                    );

                                    return {
                                        status:
                                            rerunSucceeded
                                                ? "applied"
                                                : "failed",

                                        attempted:
                                            true,

                                        rerunAttempted:
                                            true,

                                        rerunSucceeded,

                                        healingAttempts:
                                            1,

                                        error:
                                            rerunSucceeded
                                                ? null
                                                : "Rerun failed.",
                                    };
                                },
                            );

                        await ExecutionController.run(
                            nodes,
                            {
                                edges: [],
                            },
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                       

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );

            },
        );

        describe(
            "pause",
            () => {
                it(
                    "pauses execution",
                    () => {
                        ExecutionController.pause();

                        expect(
                            mocks.pauseExecution,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.resumeExecution,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.stopExecution,
                        ).not.toHaveBeenCalled();
                    },
                );
            },
        );

        describe(
            "resume",
            () => {
                it(
                    "resumes execution",
                    () => {
                        ExecutionController.resume();

                        expect(
                            mocks.resumeExecution,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.pauseExecution,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.stopExecution,
                        ).not.toHaveBeenCalled();
                    },
                );
            },
        );

        describe(
            "stop",
            () => {
                it(
                    "stops execution",
                    () => {
                        ExecutionController.stop();

                        expect(
                            mocks.stopExecution,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.pauseExecution,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.resumeExecution,
                        ).not.toHaveBeenCalled();
                    },
                );
            },
        );
    },
);