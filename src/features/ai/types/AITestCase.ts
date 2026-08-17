export type AITestCasePriority =
    | "critical"
    | "high"
    | "medium"
    | "low";

export type AITestCaseType =
    | "functional"
    | "negative"
    | "validation"
    | "edge";

export interface AITestCaseStep {
    order: number;

    action: string;

    testData?: string;

    expected?: string;
}

export interface AITestCase {
    id: string;

    title: string;

    description?: string;

    priority: AITestCasePriority;

    type: AITestCaseType;

    preconditions: string[];

    steps: AITestCaseStep[];

    expectedResult: string;
}

export interface AITestCaseGenerationResult {
    requirement: string;

    testCases: AITestCase[];
}