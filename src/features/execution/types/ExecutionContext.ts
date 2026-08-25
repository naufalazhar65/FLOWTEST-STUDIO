import type {
    Edge,
} from "reactflow";

export interface ExecutionContext {
    edges: Edge[];

    retry?: {
        enabled?: boolean;

        maxAttempts?: number;

        retryDelayMs?: number;
    };
}