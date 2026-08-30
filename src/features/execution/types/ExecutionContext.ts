import type {
    Edge,
} from "reactflow";
import type { VariableStore } from "../variables/VariableStore";

export interface ExecutionContext {
    edges: Edge[];

    variableStore?: VariableStore;

    retry?: {
        enabled?: boolean;

        maxAttempts?: number;

        retryDelayMs?: number;
    };
}