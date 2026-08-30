export type AIAllowedOperation =
    | "locatorRepair"
    | "addWait"
    | "interaction"
    | "assertion"
    | "flowGeneration";

export interface AIAssistantSettings {
    requireHealingApproval:
    boolean;

    allowedOperations:
    AIAllowedOperation[];
}
