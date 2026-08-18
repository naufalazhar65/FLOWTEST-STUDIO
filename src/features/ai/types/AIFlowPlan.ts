import type {
    AssertOperator,
    NodeAction,
} from "../../flow/types/flowNode";

import type {
    LocatorStrategy,
} from "../../execution/types/LocatorStrategy";

export type AIFlowAction =
    NodeAction;

export interface AIFlowStep {
    id: string;

    action:
    AIFlowAction;

    title: string;

    description: string;

    semanticTarget?:
    string | null;

    locatorStrategy?:
    | LocatorStrategy
    | null;

    locator?:
    string | null;

    text?:
    string | null;

    variableName?:
    string | null;

    duration?:
    number | null;

    actual?:
    string | null;

    operator?:
    | AssertOperator
    | null;

    expected?:
    string | null;

    appPackage?:
    string | null;

    appActivity?:
    string | null;

    noReset?:
    boolean | null;

    timeout?:
    number | null;

    pollingInterval?:
    number | null;

    attribute?:
    string | null;

    count?:
    number | null;

    direction?:
    | "up"
    | "down"
    | "left"
    | "right"
    | null;

    distance?:
    number | null;

    amount?:
    number | null;

    speed?:
    number | null;

    percent?:
    number | null;

    fileName?:
    string | null;

    platform?:
    | "Android"
    | "iOS"
    | null;

    bundleId?:
    string | null;

    app?:
    string | null;
}

export interface AIFlowPlan {
    type:
    "flow_plan";

    summary:
    string;

    /**
     * Existing nodes from the current
     * FlowTest Studio graph that must be
     * executed before the generated steps.
     *
     * These nodes are references only.
     * They are NOT additional test-case steps.
     */
    prerequisiteNodeIds?:
    string[];

    /**
     * Exactly one generated flow step
     * for each approved test-case step.
     */
    steps:
    AIFlowStep[];

    warnings?:
    string[];
}