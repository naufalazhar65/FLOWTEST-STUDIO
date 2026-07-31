import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const delayRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "delay") {
            return;
        }

        const startedAt = performance.now();

        const duration = Number(node.data.duration);

        try {
            await new Promise<void>((resolve) =>
                setTimeout(resolve, duration),
            );

            const elapsed =
                performance.now() - startedAt;

            executionLogger.success({
                message: "Delay completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    duration,
                },
            });
        } catch (error) {
            const elapsed =
                performance.now() - startedAt;

            executionLogger.error({
                message: "Delay failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    duration,
                    reason:
                        error instanceof Error
                            ? error.message
                            : String(error),
                },
            });

            throw error;
        }
    },
};