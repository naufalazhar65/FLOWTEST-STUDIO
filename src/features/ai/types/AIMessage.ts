import type { AIFlowPlan } from "./AIFlowPlan";
import type {
    AIModificationPlan,
} from "./AIModificationPlan";

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
}