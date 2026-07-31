import { executionLogger } from "../services/executionLogger";
import type { FlowNode } from "../../flow/types/flowNode";

interface ExecuteGetterOptions<T> {
    node: FlowNode;

    message: string;

    getter: () => Promise<T>;

    details: Record<string, unknown>;
}

export async function executeGetterWithLogging<T>({
    node,
    message,
    getter,
    details,
}: ExecuteGetterOptions<T>) {

    const startedAt = performance.now();

    try {

        const value = await getter();

        executionLogger.success({
            message,
            nodeId: node.id,
            nodeType: node.data.action,
            nodeTitle: node.data.title,
            duration: performance.now() - startedAt,
            details: {
                ...details,
                value,
            },
        });

        return value;

    } catch (error) {

        executionLogger.error({
            message: `${message} failed`,
            nodeId: node.id,
            nodeType: node.data.action,
            nodeTitle: node.data.title,
            duration: performance.now() - startedAt,
            details: {
                ...details,
                reason:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
        });

        throw error;
    }
}