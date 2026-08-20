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
    validateFlow,
} from "../../flow/validation/validateFlow";

import {
    GraphNavigator,
} from "../graph/GraphNavigator";

import {
    clearVariables,
} from "../variables/VariableStore";

import {
    formatDuration,
} from "../utils/formatDuration";

import {
    executeNode,
} from "./executeNode";

import {
    executeRepeat,
} from "./executeRepeat";

import {
    executionLogger,
} from "../services/executionLogger";

import {
    waitWhilePaused,
} from "../utils/waitWhilePaused";

import {
    recordExecutionReport,
} from "../../reports/services/reportRecorder";

interface ExecuteFlowOptions {
    skipNodeIds?:
    ReadonlySet<string>;
}

export async function executeFlow(
    nodes: FlowNode[],
    context: ExecutionContext,
    options?: ExecuteFlowOptions,
) {
    const execution =
        useExecutionStore.getState();

    const reportStartedAt =
        Date.now();

    // ---------------------------------------
    // Reset
    // ---------------------------------------

    executionLogger.clear();

    execution.reset();

    const graph =
        new GraphNavigator(
            nodes,
            context.edges,
        );

    clearVariables();

    execution.startExecution(
        nodes.length,
    );

    executionLogger.info({
        message:
            "Starting execution...",
    });

    const startedAt =
        performance.now();

    // ---------------------------------------
    // Validation
    // ---------------------------------------

    const validation =
        validateFlow(nodes);

    if (
        !validation.valid
    ) {
        execution.setStatus(
            "failed",
        );

        execution.setCurrentNode(
            null,
        );

        executionLogger.error({
            message:
                "Flow validation failed.",

            details: {
                errors:
                    validation.errors
                        .length,
            },
        });

        console.group(
            "Flow validation failed",
        );

        validation.errors.forEach(
            (
                nodeError,
                index,
            ) => {
                console.group(
                    `${index + 1}. ${nodeError.nodeTitle} (${nodeError.nodeId})`,
                );

                nodeError.errors.forEach(
                    (
                        error,
                    ) => {
                        console.error(
                            error,
                        );
                    },
                );

                console.groupEnd();
            },
        );

        console.groupEnd();

        const finishedAt =
            Date.now();

        const duration =
            performance.now() -
            startedAt;

        recordExecutionReport({
            status:
                "failed",

            startedAt:
                reportStartedAt,

            finishedAt,

            duration,
        });

        throw new Error(
            "Flow contains validation errors.",
        );
    }

    try {
        // ---------------------------------------
        // Execute Nodes
        // ---------------------------------------

        let currentNode =
            graph.getStartNode();

        let activeEdgeId:
            string | null =
            null;

        while (
            currentNode
        ) {
            const node =
                currentNode;

            // ---------------------------------------
            // Pause
            // ---------------------------------------

            await waitWhilePaused();

            // ---------------------------------------
            // Check Stop Before Node
            // ---------------------------------------

            if (
                useExecutionStore
                    .getState()
                    .status ===
                "stopped"
            ) {
                break;
            }

            execution.setCurrentNode(
                node.id,
            );

            const shouldSkip =
                options?.skipNodeIds?.has(
                    node.id,
                ) ??
                false;

            // ---------------------------------------
            // Execute / Skip Node
            // ---------------------------------------

            if (
                shouldSkip
            ) {
                const skippedAt =
                    Date.now();

                execution.setNodeStatus(
                    node.id,
                    "passed",
                );

                execution.setNodeResult({
                    nodeId:
                        node.id,

                    nodeType:
                        node.data.action,

                    nodeTitle:
                        node.data.title,

                    status:
                        "passed",

                    startedAt:
                        skippedAt,

                    finishedAt:
                        skippedAt,

                    duration:
                        0,
                });

                executionLogger.info({
                    message:
                        "Node already executed before flow start; skipping execution.",

                    nodeId:
                        node.id,

                    nodeType:
                        node.data.action,

                    nodeTitle:
                        node.data.title,
                });
            } else {
                // ---------------------------------------
                // Breakpoint
                // ---------------------------------------

                if (
                    node.data.debug
                        .breakpoint
                ) {
                    executionLogger.info({
                        message:
                            "Breakpoint reached",

                        nodeId:
                            node.id,

                        nodeType:
                            node.data.action,

                        nodeTitle:
                            node.data.title,
                    });

                    execution.pauseExecution();

                    await waitWhilePaused();

                    // Stop may have been
                    // pressed while paused.
                    if (
                        useExecutionStore
                            .getState()
                            .status ===
                        "stopped"
                    ) {
                        break;
                    }
                }

                // ---------------------------------------
                // Execute Repeat
                // ---------------------------------------

                if (
                    node.data.action ===
                    "repeat"
                ) {
                    execution.setNodeStatus(
                        node.id,
                        "running",
                    );

                    const repeatStartedAt =
                        Date.now();

                    try {
                        const repeatResult =
                            await executeRepeat(
                                node,
                                nodes,
                                context,
                            );

                        const repeatFinishedAt =
                            Date.now();

                        execution.setNodeStatus(
                            node.id,
                            "passed",
                        );

                        execution.setNodeResult({
                            nodeId:
                                node.id,

                            nodeType:
                                node.data.action,

                            nodeTitle:
                                node.data.title,

                            status:
                                "passed",

                            startedAt:
                                repeatStartedAt,

                            finishedAt:
                                repeatFinishedAt,

                            duration:
                                repeatFinishedAt -
                                repeatStartedAt,
                        });

                        currentNode =
                            repeatResult.nextNode;

                        activeEdgeId =
                            null;

                        continue;
                    } catch (
                    error
                    ) {
                        execution.setNodeStatus(
                            node.id,
                            "failed",
                        );

                        throw error;
                    }
                }

                // ---------------------------------------
                // Execute Node
                // ---------------------------------------

                const result =
                    await executeNode(
                        node,
                        context,
                    );

                // ---------------------------------------
                // Check Stop After Node
                // ---------------------------------------

                if (
                    useExecutionStore
                        .getState()
                        .status ===
                    "stopped"
                ) {
                    if (
                        activeEdgeId
                    ) {
                        execution.setEdgeStatus(
                            activeEdgeId,
                            "passed",
                        );

                        activeEdgeId =
                            null;
                    }

                    break;
                }

                // ---------------------------------------
                // Complete Active Edge
                // ---------------------------------------

                if (
                    activeEdgeId
                ) {
                    execution.setEdgeStatus(
                        activeEdgeId,
                        "passed",
                    );

                    activeEdgeId =
                        null;
                }

                // ---------------------------------------
                // Resolve Transition
                // ---------------------------------------

                const output =
                    result.outputs[0] ??
                    "next";

                const outgoingEdges =
                    graph.getOutgoingEdges(
                        node.id,
                    );

                if (
                    outgoingEdges.length ===
                    0
                ) {

                    currentNode =
                        null;


                    continue;
                }

                const transition =
                    graph.getTransition(
                        node.id,
                        output,
                    );

                if (
                    transition
                ) {
                    execution.setEdgeStatus(
                        transition.edge.id,
                        "running",
                    );

                    activeEdgeId =
                        transition.edge.id;

                    currentNode =
                        transition.nextNode;
                } else {
                    console.error(
                        "[EXECUTION] No matching transition found:",
                        {
                            nodeId:
                                node.id,

                            action:
                                node.data.action,

                            output,

                            availableOutputs:
                                outgoingEdges.map(
                                    (
                                        edge,
                                    ) =>
                                        edge.sourceHandle ??
                                        "next",
                                ),

                            rawEdges:
                                JSON.stringify(
                                    outgoingEdges.map(
                                        (
                                            edge,
                                        ) => ({
                                            id:
                                                edge.id,

                                            source:
                                                edge.source,

                                            sourceHandle:
                                                edge.sourceHandle,

                                            target:
                                                edge.target,

                                            targetHandle:
                                                edge.targetHandle,
                                        }),
                                    ),
                                    null,
                                    2,
                                ),
                        },
                    );

                    currentNode =
                        null;
                }

                continue;
            }

            // ---------------------------------------
            // Check Stop After Skipped Node
            // ---------------------------------------

            if (
                useExecutionStore
                    .getState()
                    .status ===
                "stopped"
            ) {
                if (
                    activeEdgeId
                ) {
                    execution.setEdgeStatus(
                        activeEdgeId,
                        "passed",
                    );

                    activeEdgeId =
                        null;
                }

                break;
            }

            // ---------------------------------------
            // Complete Active Edge
            // ---------------------------------------

            if (
                activeEdgeId
            ) {
                execution.setEdgeStatus(
                    activeEdgeId,
                    "passed",
                );

                activeEdgeId =
                    null;
            }

            // ---------------------------------------
            // Resolve Transition For Skipped Node
            // ---------------------------------------

            const outgoingEdges =
                graph.getOutgoingEdges(
                    node.id,
                );

            if (
                outgoingEdges.length ===
                0
            ) {

                currentNode =
                    null;

                continue;
            }

            const transition =
                graph.getTransition(
                    node.id,
                    "next",
                );

            if (
                transition
            ) {
                execution.setEdgeStatus(
                    transition.edge.id,
                    "running",
                );

                activeEdgeId =
                    transition.edge.id;

                currentNode =
                    transition.nextNode;
            } else {
                console.error(
                    "[EXECUTION] No matching transition found for skipped node:",
                    {
                        nodeId:
                            node.id,

                        action:
                            node.data.action,

                        output:
                            "next",

                        availableOutputs:
                            outgoingEdges.map(
                                (
                                    edge,
                                ) =>
                                    edge.sourceHandle ??
                                    "next",
                            ),
                    },
                );

                currentNode =
                    null;
            }
        }

        // ---------------------------------------
        // Check Final Status
        // ---------------------------------------

        const finalStatus =
            useExecutionStore
                .getState()
                .status;

        // ---------------------------------------
        // Execution Stopped
        // ---------------------------------------

        if (
            finalStatus ===
            "stopped"
        ) {
            execution.finishExecution();

            execution.setStatus(
                "stopped",
            );

            const duration =
                performance.now() -
                startedAt;

            executionLogger.info({
                message:
                    "Execution stopped by user.",

                duration,

                details: {
                    formattedDuration:
                        formatDuration(
                            duration,
                        ),

                    executedNodes:
                        useExecutionStore
                            .getState()
                            .executedNodes,

                    totalNodes:
                        nodes.length,
                },
            });

            recordExecutionReport({
                status:
                    "stopped",

                startedAt:
                    reportStartedAt,

                finishedAt:
                    Date.now(),

                duration,
            });

            return;
        }

        // ---------------------------------------
        // Finish Successful Execution
        // ---------------------------------------

        execution.finishExecution();

        execution.setStatus(
            "passed",
        );

        const duration =
            performance.now() -
            startedAt;

        executionLogger.success({
            message:
                "Execution finished",

            duration,

            details: {
                formattedDuration:
                    formatDuration(
                        duration,
                    ),

                totalNodes:
                    nodes.length,
            },
        });

        // ---------------------------------------
        // Create Passed Report
        // ---------------------------------------

        recordExecutionReport({
            status:
                "passed",

            startedAt:
                reportStartedAt,

            finishedAt:
                Date.now(),

            duration,
        });
    } catch (
    error
    ) {
        // ---------------------------------------
        // Check Whether Execution Was Stopped
        // ---------------------------------------

        const currentStatus =
            useExecutionStore
                .getState()
                .status;

        const duration =
            performance.now() -
            startedAt;

        // ---------------------------------------
        // Execution Stopped
        // ---------------------------------------

        if (
            currentStatus ===
            "stopped"
        ) {
            execution.finishExecution();

            execution.setStatus(
                "stopped",
            );

            executionLogger.info({
                message:
                    "Execution stopped by user.",

                duration,

                details: {
                    formattedDuration:
                        formatDuration(
                            duration,
                        ),

                    executedNodes:
                        useExecutionStore
                            .getState()
                            .executedNodes,

                    totalNodes:
                        nodes.length,
                },
            });

            recordExecutionReport({
                status:
                    "stopped",

                startedAt:
                    reportStartedAt,

                finishedAt:
                    Date.now(),

                duration,
            });

            return;
        }

        // ---------------------------------------
        // Execution Failed
        // ---------------------------------------

        execution.finishExecution();

        execution.setStatus(
            "failed",
        );

        execution.setCurrentNode(
            null,
        );

        executionLogger.error({
            message:
                "Execution failed",

            duration,

            details: {
                formattedDuration:
                    formatDuration(
                        duration,
                    ),

                reason:
                    error instanceof Error
                        ? error.message
                        : String(
                            error,
                        ),
            },
        });

        // ---------------------------------------
        // Create Failed Report
        // ---------------------------------------

        recordExecutionReport({
            status:
                "failed",

            startedAt:
                reportStartedAt,

            finishedAt:
                Date.now(),

            duration,
        });

        throw error;
    } finally {
        execution.setCurrentNode(
            null,
        );
    }
}