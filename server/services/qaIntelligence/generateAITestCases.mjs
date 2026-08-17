import {
    normalizeTestCaseGenerationResult,
} from "./generateTestCases.mjs";

const baseUrl =
    process.env.OLLAMA_BASE_URL ??
    "http://localhost:11434";

const model =
    process.env.OLLAMA_MODEL ??
    "qwen3:1.7b";

function buildTestCaseSystemPrompt() {
    return `
You are the Test Case Generation engine for FlowTest Studio.

You support Indonesian and English.

Generate structured software QA test cases from the user's requirement.

The requirement is the source of truth.

Do not generate executable FlowTest Studio nodes yet.
Do not generate locators unless the requirement explicitly provides them.
Do not invent application details that are not present in the requirement.

Return ONLY valid JSON.

The top-level JSON must contain:

{
  "testCases": [...]
}

Each test case MUST contain:

{
  "id": "TC-001",
  "title": "string",
  "description": "string",
  "priority": "critical | high | medium | low",
  "type": "functional | negative | validation | edge",
  "preconditions": ["string"],
  "steps": [
    {
      "order": 1,
      "action": "string",
      "testData": "string",
      "expected": "string"
    }
  ],
  "expectedResult": "string"
}

Rules:

- Generate practical QA test cases.
- Use concise and testable step actions.
- Keep the step order sequential starting from 1.
- Include test data only when relevant.
- Include expected behavior for important steps when useful.
- The final expectedResult must describe the observable outcome.
- Priority should reflect business/test risk implied by the requirement.
- Use "functional" for normal positive behavior.
- Use "negative" for invalid input or rejected behavior.
- Use "validation" for validation rules or field constraints.
- Use "edge" for boundary or unusual conditions.
- Do not invent requirements that are not supported by the input.
- Prefer a small number of high-quality test cases over many repetitive cases.
`;
}

function normalizeRequirement(
    requirement,
) {
    if (
        typeof requirement !==
            "string"
    ) {
        return null;
    }

    const normalized =
        requirement.trim();

    return normalized
        ? normalized
        : null;
}

export async function generateAITestCases(
    requirement,
) {
    const normalizedRequirement =
        normalizeRequirement(
            requirement,
        );

    if (!normalizedRequirement) {
        throw new Error(
            "Requirement is required.",
        );
    }

    const response =
        await fetch(
            `${baseUrl}/api/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    model,

                    stream: false,

                    messages: [
                        {
                            role:
                                "system",

                            content:
                                buildTestCaseSystemPrompt(),
                        },

                        {
                            role:
                                "user",

                            content:
                                JSON.stringify({
                                    requirement:
                                        normalizedRequirement,
                                }),
                        },
                    ],

                    format:
                        "json",

                    options: {
                        temperature:
                            0,

                        num_ctx:
                            8192,
                    },
                }),
            },
        );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            `Ollama test-case request failed (${response.status}): ${errorText}`,
        );
    }

    const data =
        await response.json();

    const content =
        data?.message?.content;

    if (
        typeof content !==
        "string"
    ) {
        throw new Error(
            "Ollama returned an invalid test-case message.",
        );
    }

    let parsed;

    try {
        parsed =
            JSON.parse(
                content,
            );
    } catch {
        throw new Error(
            `Ollama returned invalid test-case JSON: ${content}`,
        );
    }

    const result =
        normalizeTestCaseGenerationResult(
            normalizedRequirement,
            parsed,
        );

    if (!result) {
        throw new Error(
            "Ollama returned no valid test cases.",
        );
    }

    return result;
}