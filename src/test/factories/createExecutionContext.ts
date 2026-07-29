import type { ExecutionContext } from "../../features/execution/types/ExecutionContext";

export function createExecutionContext(): ExecutionContext {
    return {
        device: "Android",
        edges: [],
        services: {
            driver: {} as never,
            logger: {} as never,
            variables: {} as never,
        },
    };
}