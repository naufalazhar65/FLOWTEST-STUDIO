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

IMPORTANT STEP COVERAGE RULES:

- Every distinct user action, system action, validation, or expected observable behavior explicitly described in the requirement MUST be represented by a test step.
- Never skip a meaningful requirement step.
- Never merge multiple distinct requirement actions into one step.
- Preserve the logical order described by the requirement.
- A successful end-state described by the requirement MUST normally become an explicit verification/assertion step.
- If the requirement describes:
  1. entering username,
  2. entering password,
  3. tapping Login,
  4. seeing the Dashboard,
  then the generated test case MUST contain four corresponding steps.
- The final verification must not exist only inside expectedResult when it represents a distinct observable behavior.
- The number of steps should reflect the number of distinct actions and observable outcomes in the requirement, not an arbitrary compact summary.
- Do not omit a step merely because another step implies it.

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
- Include expected behavior for meaningful intermediate steps when useful.
- The final expectedResult must describe the observable final outcome.
- When the requirement explicitly contains a sequence of actions, preserve the complete sequence.
- Include a final verification step when the requirement specifies a visible, measurable, or otherwise observable success condition.
- Priority should reflect business/test risk implied by the requirement.
- Use "functional" for normal positive behavior.
- Use "negative" for invalid input or rejected behavior.
- Use "validation" for validation rules or field constraints.
- Use "edge" for boundary or unusual conditions.
- Do not invent requirements that are not supported by the input.
- Multiple test cases may cover genuinely different scenarios, but do not remove required steps from a scenario merely to keep the test case short.

CRITICAL EXAMPLE:

Requirement:

"User should be able to log in with valid credentials.

The user is on the login screen.
Enter a valid username into the username field.
Enter a valid password into the password field.
Tap the Login button.
After successful login, the Dashboard screen should be displayed."

The correct functional test case MUST contain:

Step 1:
Enter a valid username into the username field.

Step 2:
Enter a valid password into the password field.

Step 3:
Tap the Login button.

Step 4:
Verify that the Dashboard screen is displayed.

Do NOT return only three steps.
Do NOT put the Dashboard verification only in expectedResult.
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