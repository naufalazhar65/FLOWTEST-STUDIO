import type {
    AssertOperator,
    NodeAction,
} from "../../flow/types/flowNode";

import type {
    LocatorStrategy,
} from "../../execution/types/LocatorStrategy";

export type ModificationOperation =
    | "addNodeAfter"
    | "addNodeBefore"
    | "updateNode"
    | "deleteNode";

export interface ModificationStep {
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

export type ModificationOperationData =
    | {
        type:
        | "addNodeAfter"
        | "addNodeBefore"
        | "updateNode";

        targetNodeId: string;

        step: ModificationStep;

        resultId?: string;
    }
    | {
        type: "deleteNode";

        targetNodeId: string;
    };

interface ModificationPlanBase {
    type: "modification_plan";

    summary: string;

    warnings?: string[];
}

export interface ModificationPlanSingle
    extends ModificationPlanBase {
    operation:
    ModificationOperationData;

    operations?: undefined;
}

export interface ModificationPlanMultiple
    extends ModificationPlanBase {
    operation?: undefined;

    operations:
    ModificationOperationData[];
}

export type ModificationPlan =
    | ModificationPlanSingle
    | ModificationPlanMultiple;