import type { ExecutionContext } from "../../features/execution/types/ExecutionContext";

export function createExecutionContext(): ExecutionContext {
    return {
        device: "Android",
        edges: [],
    };
}