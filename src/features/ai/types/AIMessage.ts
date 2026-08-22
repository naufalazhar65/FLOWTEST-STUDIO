import type {
    AIFlowPlan,
} from "./AIFlowPlan";

import type {
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

import type {
    AIQARecommendation,
} from "./AIRequest";

export type AIMessageRole =
    | "user"
    | "assistant"
    | "system";

export interface AIMessage {
    id: string;

    role: AIMessageRole;

    content: string;

    flowPlan?:
    AIFlowPlan;

    modificationPlan?:
    ModificationPlan;

    createdAt: number;

    qaRecommendations?:
    AIQARecommendation[];
}