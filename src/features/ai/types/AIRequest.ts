import type { AIFlowPlan } from "./AIFlowPlan";

import type {
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

import type {
    AIExecutionContext,
} from "./AIExecutionContext";

export type AIIntent =
    | "analyzeFlow"
    | "analyzeSelectedNode"
    | "analyzeExecution"
    | "generateFlow"
    | "modifyFlow"
    | "reviewFlow";

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

    context:
    AIExecutionContext;

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

export interface AIQARecommendation {
    id: string;

    priority:
    | "critical"
    | "high"
    | "medium"
    | "low";

    impact:
    | "high"
    | "medium"
    | "low";

    score: number;

    category: string;

    finding: string;

    nodeId: string | null;

    action: string | null;

    title: string;

    description: string;

    recommendation:
    string | null;

    suggestedFix:
    | {
        type: string;

        title?: string;

        description?: string;

        targetNodeId:
        string | null;

        confidence?:
        | "high"
        | "medium"
        | "low";

        reason?: string;

        autoApplicable?: boolean;

        currentLocator?:
        string | null;

        suggestedLocator?:
        string | null;

        locatorStrategy?:
        string | null;
    }
    | null;
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
    ModificationPlan;

    clarification?:
    AIClarification;

    qaRecommendations?:
    AIQARecommendation[];
}