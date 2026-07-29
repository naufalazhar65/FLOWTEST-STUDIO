import type { Edge } from "reactflow";

export interface CreateEdgeOptions {
    id?: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}

export function createEdge(
    options: CreateEdgeOptions
): Edge {
    return {
        id:
            options.id ??
            `${options.source}-${options.target}`,

        source: options.source,

        target: options.target,

        sourceHandle:
            options.sourceHandle,

        targetHandle:
            options.targetHandle,
    };
}