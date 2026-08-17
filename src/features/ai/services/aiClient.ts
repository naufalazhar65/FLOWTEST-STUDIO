import type {
    AIRequest,
    AIResponse,
    AIQARecommendation,
} from "../types/AIRequest";

import type {
    AIModificationPlan,
} from "../types/AIModificationPlan";

import type {
    AITestCaseGenerationResult,
} from "../types/AITestCase";

const AI_API_URL =
    import.meta.env.VITE_AI_API_URL ??
    "http://localhost:8787";

export async function sendAIRequest(
    request: AIRequest,
): Promise<AIResponse> {
    const response = await fetch(
        `${AI_API_URL}/api/ai`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify(
                request,
            ),
        },
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            typeof data?.error ===
                "string"
                ? data.error
                : `AI request failed with status ${response.status}.`,
        );
    }

    return data as AIResponse;
}

export async function requestQAFixPlan(
    recommendation: AIQARecommendation,
    context: AIRequest["context"],
): Promise<AIModificationPlan> {
    const response = await fetch(
        `${AI_API_URL}/api/ai/qa/fix`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                recommendation,
                context,
            }),
        },
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            typeof data?.error ===
                "string"
                ? data.error
                : `QA fix request failed with status ${response.status}.`,
        );
    }

    if (
        !data?.modificationPlan ||
        typeof data.modificationPlan !==
            "object"
    ) {
        throw new Error(
            "QA fix response did not contain a valid modification plan.",
        );
    }

    return data.modificationPlan as AIModificationPlan;
}

export async function generateAITestCases(
    requirement: string,
): Promise<AITestCaseGenerationResult> {
    const response = await fetch(
        `${AI_API_URL}/api/ai/test-cases`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                requirement,
            }),
        },
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            typeof data?.error ===
                "string"
                ? data.error
                : `AI test-case request failed with status ${response.status}.`,
        );
    }

    if (
        !data ||
        typeof data !==
            "object" ||
        !Array.isArray(
            data.testCases,
        )
    ) {
        throw new Error(
            "AI test-case response did not contain valid test cases.",
        );
    }

    return data as AITestCaseGenerationResult;
}