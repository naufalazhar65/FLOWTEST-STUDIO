export type LocatorStrategy =
    | "accessibilityId"
    | "id"
    | "xpath"
    | "className"
    | "androidUiAutomator"
    | "iosPredicate"
    | "iosClassChain";

export interface LocatorCandidate {
    strategy: LocatorStrategy;

    value: string;

    score: number;

    recommended: boolean;

    reason?: string;
}