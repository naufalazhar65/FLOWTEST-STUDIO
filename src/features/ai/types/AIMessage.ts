import type { AIFlowPlan } from "./AIFlowPlan";
import type {
    AIModificationPlan,
} from "./AIModificationPlan";
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

    flowPlan?: AIFlowPlan;

    modificationPlan?:
    AIModificationPlan;

    createdAt: number;

    qaRecommendations?:
    AIQARecommendation[];
}