import type {
    AIFlowPlan,
} from "./AIFlowPlan";

import type {
    AITestCase,
} from "./AITestCase";

import type {
    AIFlowContext,
} from "./AIRequest";

export interface AITestCaseFlowRequest {
    testCase: AITestCase;

    context: AIFlowContext;
}

export interface AITestCaseFlowResponse {
    testCaseId: string;

    flowPlan: AIFlowPlan;
}