import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getRunner } from "../services/runnerRegistry";

import { useExecutionStore } from "../store/useExecutionStore";
import { useExecutionLogStore } from "../store/useExecutionLogStore";

import { validateFlow } from "../../flow/validation/validateFlow";
import { buildExecutionOrder } from "../../flow/graph/buildExecutionOrder";

import { clearVariables } from "../variables/VariableStore";
import { formatDuration } from "../utils/formatDuration";

export async function executeFlow(
    nodes: FlowNode[],
    context: ExecutionContext
) {
    const execution = useExecutionStore.getState();
    const log = useExecutionLogStore.getState();

    // ---------------------------------------
    // Reset
    // ---------------------------------------

    log.clear();

    execution.reset();

    clearVariables();

    execution.setStatus("running");

    log.addLog(
        "info",
        "Starting execution..."
    );

    const startedAt = performance.now();

    // ---------------------------------------
    // Validation
    // ---------------------------------------

    const validation = validateFlow(nodes);

    if (!validation.valid) {
        execution.setStatus("failed");

        log.addLog(
            "error",
            "Flow validation failed."
        );

        console.error(
            "Flow validation failed",
            validation.errors
        );

        throw new Error(
            "Flow contains validation errors."
        );
    }

    try {
        const orderedNodes = buildExecutionOrder(
            nodes,
            context.edges
        );

        // ---------------------------------------
        // Execute Nodes
        // ---------------------------------------

        for (const node of orderedNodes) {
            execution.setCurrentNode(node.id);

            execution.setNodeStatus(
                node.id,
                "running"
            );

            log.addLog(
                "info",
                `Running ${node.data.action}`
            );

            const runner = getRunner(
                node.data.action
            );

            try {
                await runner.run(
                    node,
                    context
                );

                // supaya animasi node terlihat
                await new Promise((resolve) =>
                    setTimeout(resolve, 350)
                );

                execution.setNodeStatus(
                    node.id,
                    "passed"
                );

                log.addLog(
                    "success",
                    `${node.data.action} completed`
                );
            } catch (error) {
                execution.setNodeStatus(
                    node.id,
                    "failed"
                );

                execution.setStatus("failed");

                log.addLog(
                    "error",
                    `${node.data.action} failed`
                );

                const duration =
                    performance.now() - startedAt;

                log.addLog(
                    "error",
                    `Execution failed after ${formatDuration(
                        duration
                    )}`
                );

                throw error;
            }
        }

        // ---------------------------------------
        // Finish
        // ---------------------------------------

        execution.setStatus("passed");

        const duration =
            performance.now() - startedAt;

        log.addLog(
            "success",
            `Execution finished in ${formatDuration(
                duration
            )}`
        );
    } finally {
        execution.setCurrentNode(null);
    }
}