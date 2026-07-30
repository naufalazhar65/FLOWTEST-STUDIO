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

        let activeEdgeId: string | null = null;

        while (currentNode) {
            const node = currentNode;

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

            // Node ini baru selesai dieksekusi,
            // maka edge yang menuju node ini juga selesai.

            if (activeEdgeId) {
                execution.setEdgeStatus(
                    activeEdgeId,
                    "passed"
                );

                activeEdgeId = null;
            }

            const output =
                result.outputs[0] ?? "next";

            const transition =
                graph.getTransition(
                    node.id,
                    output
                );

            if (transition) {
                execution.setEdgeStatus(
                    transition.edge.id,
                    "running"
                );

                // Simpan edge yang sedang aktif
                activeEdgeId = transition.edge.id;

                // Pindah ke node berikutnya
                currentNode = transition.nextNode;
            } else {
                currentNode = null;
            }
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
