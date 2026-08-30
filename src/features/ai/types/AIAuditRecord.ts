import type {
    Edge,
} from "reactflow";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    PlanDiff,
} from "../services/flowPlanDiff";

export type AIAuditKind =
    | "flow"
    | "modification";

export interface AIAuditRecord {
    id: string;

    kind: AIAuditKind;

    summary: string;

    createdAt: number;

    status:
    | "applied"
    | "rolledBack";

    diff: PlanDiff;

    beforeNodes: FlowNode[];

    beforeEdges: Edge[];
}
