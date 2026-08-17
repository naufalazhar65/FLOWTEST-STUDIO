import type {
    AssertOperator,
    NodeAction,
} from "../../flow/types/flowNode";

import type {
    LocatorStrategy,
} from "../../execution/types/LocatorStrategy";

export type AIModificationOperation =
    | "addNodeAfter"
    | "addNodeBefore"
    | "updateNode"
    | "deleteNode";

export interface AIModificationStep {
    action: NodeAction;

    title?: string;

    description?: string;

    locatorStrategy?: LocatorStrategy;

    locator?: string;

    text?: string;

    duration?: number;

    actual?: string;

    operator?: AssertOperator;

    expected?: string;

    variableName?: string;

    timeout?: number;

    pollingInterval?: number;
}

export type AIModificationOperationData =
    | {
        type:
            | "addNodeAfter"
            | "addNodeBefore"
            | "updateNode";

        targetNodeId: string;

        step: AIModificationStep;

        resultId?: string;
    }
    | {
        type: "deleteNode";

        targetNodeId: string;
    };

interface AIModificationPlanBase {
    type: "modification_plan";

    summary: string;

    warnings?: string[];
}

export interface AIModificationPlanSingle
    extends AIModificationPlanBase {
    operation:
        AIModificationOperationData;

    operations?: never;
}

export interface AIModificationPlanMultiple
    extends AIModificationPlanBase {
    operation?: never;

    operations:
        AIModificationOperationData[];
}

export type AIModificationPlan =
    | AIModificationPlanSingle
    | AIModificationPlanMultiple;