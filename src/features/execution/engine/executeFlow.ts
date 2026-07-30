import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { useExecutionStore } from "../store/useExecutionStore";

import { validateFlow } from "../../flow/validation/validateFlow";
import { GraphNavigator } from "../graph/GraphNavigator";

import { clearVariables } from "../variables/VariableStore";
import { formatDuration } from "../utils/formatDuration";

import { executeNode } from "./executeNode";
import { executionLogger } from "../services/executionLogger";
import { waitWhilePaused } from "../utils/waitWhilePaused";

export async function executeFlow(
    nodes: FlowNode[],
    context: ExecutionContext
) {
    const execution = useExecutionStore.getState();

    // ---------------------------------------
    // Reset
    // ---------------------------------------

    executionLogger.clear();
    execution.reset();

    const graph = new GraphNavigator(
        nodes,
        context.edges
    );

    clearVariables();

    execution.startExecution(
        nodes.length
    );



    executionLogger.info(
        "Starting execution..."
    );

    const startedAt = performance.now();

    // ---------------------------------------
    // Validation
    // ---------------------------------------

    const validation = validateFlow(nodes);

    if (!validation.valid) {
        execution.setStatus("failed");
        execution.setCurrentNode(null);

        executionLogger.error(
            "Flow validation failed."
        );

        console.group("Flow validation failed");

        validation.errors.forEach((nodeError, index) => {
            console.group(
                `${index + 1}. ${nodeError.nodeTitle} (${nodeError.nodeId})`
            );

            nodeError.errors.forEach((error) => {
                console.error(error);
            });

            console.groupEnd();
        });

        console.groupEnd();

        validation.errors.forEach((nodeError, index) => {
            console.group(
                `${index + 1}. ${nodeError.nodeTitle} (${nodeError.nodeId})`
            );

            nodeError.errors.forEach((error) => {
                console.error(error);
            });

            console.groupEnd();
        });
        console.groupEnd();

        throw new Error(
            "Flow contains validation errors."
        );
    }

    try {
        // ---------------------------------------
        // Execute Nodes
        // ---------------------------------------

        let currentNode =
            graph.getStartNode();


        const incomingEdgeMap = new Map<string, string>();

        for (const edge of context.edges) {
            incomingEdgeMap.set(
                edge.target,
                edge.id
            );
        }

        while (currentNode) {
            const node = currentNode;

            const incomingEdgeId =
                incomingEdgeMap.get(node.id);

            if (incomingEdgeId) {
                execution.setEdgeStatus(
                    incomingEdgeId,
                    "passed"
                );
            }

            await waitWhilePaused();

            execution.setCurrentNode(node.id);

            if (node.data.debug.breakpoint) {
                executionLogger.info(
                    `🛑 Breakpoint reached: ${node.data.title}`
                );

                execution.pauseExecution();

                await waitWhilePaused();
            }

            const result = await executeNode(
                node,
                context
            );

            const output =
                result.outputs[0] ?? "next";

            const nextNode = graph.getNextNode(
                node.id,
                output
            );

            if (nextNode) {
                const edge = context.edges.find(
                    (edge) =>
                        edge.source === node.id &&
                        edge.target === nextNode.id &&
                        (edge.sourceHandle ?? "next") === output
                );

                if (edge) {
                    execution.setEdgeStatus(
                        edge.id,
                        "running"
                    );

                }
            }

            currentNode = nextNode;
        }
        // ---------------------------------------
        // Finish
        // ---------------------------------------

        execution.finishExecution();
        execution.setStatus("passed");

        const duration =
            performance.now() - startedAt;

        executionLogger.success(
            `Execution finished in ${formatDuration(duration)}`
        );
    } catch (error) {
        execution.setStatus("failed");

        const duration =
            performance.now() - startedAt;

        executionLogger.error(
            `Execution failed after ${formatDuration(duration)}`
        );

        throw error;
    } finally {
        execution.setCurrentNode(null);
    }
}
