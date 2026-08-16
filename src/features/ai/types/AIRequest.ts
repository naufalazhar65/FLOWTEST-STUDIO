import type { AIFlowPlan } from "./AIFlowPlan";

import type {
    AIModificationPlan,
} from "./AIModificationPlan";

export type AIIntent =
    | "analyzeFlow"
    | "analyzeSelectedNode"
    | "generateFlow"
    | "modifyFlow";

export interface AIFlowContextNode {
    id: string;

    action: string;

    title: string;

    subtitle: string;

    locatorStrategy?: string;

    locator?: string;

    details?: Record<
        string,
        unknown
    >;
}

export interface AIFlowContextEdge {
    id: string;

    source: string;

    target: string;

    sourceHandle?: string | null;

    targetHandle?: string | null;
}

export interface AIFlowContext {
    selectedNodeId: string | null;

    selectedNode:
    | AIFlowContextNode
    | null;

    nodes: AIFlowContextNode[];

    edges: AIFlowContextEdge[];

    nodeCount: number;

    edgeCount: number;
}

export interface AIRequest {
    message: string;

    context: AIFlowContext;

    clarification?:
        AIPendingClarification;
}

export interface AIClarificationCandidate {
    nodeId: string;

    title: string | null;

    action: string | null;

    subtitle: string | null;
}

export interface AIClarification {
    type:
        | "target_node";

    question: string;

    candidates:
        AIClarificationCandidate[];
}

export interface AIPendingClarification {
    originalMessage: string;

    clarification:
        AIClarification;

    selectedCandidateIndex?: number | null;
}

export interface AIResponse {
    message: string;

    intent?: AIIntent;

    flowPlan?: AIFlowPlan;

    modificationPlan?:
        AIModificationPlan;

    clarification?:
        AIClarification;
}