import type { FlowNode } from "../../flow/types/flowNode";
import type { NodeExecutionResult } from "../types/NodeExecutionResult";
import type { Edge } from "reactflow";

import {
    buildFailureContext,
} from "./buildFailureContext";

import {
    classifyFailure,
} from "./classifyFailure";

import {
    analyzeFailureRootCause,
} from "./analyzeFailureRootCause";

import {
    suggestFailureFix,
} from "./suggestFailureFix";

export interface ExecutionFailureAnalysis {
    context: ReturnType<
        typeof buildFailureContext
    >;

    classification: ReturnType<
        typeof classifyFailure
    >;

    rootCause: ReturnType<
        typeof analyzeFailureRootCause
    >;

    suggestedFix: ReturnType<
        typeof suggestFailureFix
    >;
}

export function analyzeExecutionFailure(
    results: NodeExecutionResult[],
    nodes: FlowNode[],
    edges: Edge[],
): ExecutionFailureAnalysis | null {
    const failedResult =
        results.find(
            (result) =>
                result.status ===
                "failed",
        );

    if (!failedResult) {
        return null;
    }

    const context =
        buildFailureContext(
            failedResult,
            nodes,
            edges,
        );

    if (!context) {
        return null;
    }

    const classification =
        classifyFailure(
            context,
        );

    const rootCause =
        analyzeFailureRootCause(
            context,
            classification,
        );

    const suggestedFix =
        suggestFailureFix(
            context,
            rootCause,
        );

    return {
        context,
        classification,
        rootCause,
        suggestedFix,
    };
}