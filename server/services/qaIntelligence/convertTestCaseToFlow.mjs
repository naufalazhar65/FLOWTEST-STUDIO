import {
    normalizeTestCaseFlowResponse,
} from "./normalizeTestCaseFlow.mjs";

const baseUrl =
    process.env.OLLAMA_BASE_URL ??
    "http://localhost:11434";

const model =
    process.env.OLLAMA_MODEL ??
    "qwen3:1.7b";

function buildSystemPrompt() {
    return `
You are the Test Case to Flow conversion engine for FlowTest Studio.

Your job is to convert an approved QA test case into an executable FlowTest Studio flow plan.

IMPORTANT:
The test case steps are the source of truth.

Every test case step MUST be represented by exactly one flow step.

STRICT 1:1 MAPPING RULES:
- Never skip a test case step.
- Never merge multiple test case steps into one flow step.
- Never split one test case step into multiple flow steps.
- Preserve the original step order.
- The output flow plan MUST contain exactly the same number of steps as the input test case.
- Every output step MUST include sourceStepOrder corresponding to the original test case step order.
- sourceStepOrder values MUST be complete and sequential: 1, 2, 3, ... N.

Supported executable actions:
- tap
- input
- assert
- delay
- wait

Return ONLY valid JSON.

Return exactly:

{
  "testCaseId": "string",
  "flowPlan": {
    "type": "flow_plan",
    "summary": "string",
    "steps": [
      {
        "id": "string",
        "sourceStepOrder": 1,
        "action": "tap | input | assert | delay | wait",
        "title": "string",
        "description": "string",
        "locatorStrategy": "accessibilityId | id | xpath | className | androidUiAutomator | iOSPredicateString | iOSClassChain | null",
        "locator": "string | null",
        "text": "string | null",
        "duration": "number | null",
        "actual": "string | null",
        "operator": "equals | notEquals | contains | notContains | startsWith | endsWith | greaterThan | greaterThanOrEqual | lessThan | lessThanOrEqual | isTrue | isFalse | isEmpty | isNotEmpty | matches | null",
        "expected": "string | null",
        "timeout": "number | null",
        "pollingInterval": "number | null"
      }
    ],
    "warnings": []
  }
}

FIELD RULES:

For tap:
- locatorStrategy is required.
- locator is required.

For input:
- locatorStrategy is required.
- locator is required.
- text is required.
- Use testData when the original step provides it.

For assert:
- locatorStrategy MUST be null.
- locator MUST be null.
- actual MUST contain the observed value or target text.
- operator MUST be a supported assertion operator.
- expected MUST contain the expected value or target text.
- Never use "screen", "page", or other unsupported values as locatorStrategy.
- For "Dashboard screen is displayed", return:
  actual = "Dashboard"
  operator = "contains"
  expected = "Dashboard"

For delay:
- duration must be positive.

For wait:
- locatorStrategy is required.
- locator is required.
- timeout must be positive.
- pollingInterval must be positive.

CONTEXT RULES:

- Prefer locators from the current FlowTest Studio context when an existing node represents the same target.
- If the target is explicitly named in the test step, derive a reasonable locator from that target.
- Prefer accessibilityId when the target name naturally maps to an accessibility identifier.
- Do not invent unrelated application elements.
- Preserve test data from the original test case.
- Preconditions are context information and should not be silently dropped from the test case.
- If a natural-language action can be represented by one supported executable action, convert it.
- Do not answer with explanations or markdown.

IMPORTANT EXAMPLE:

Input test case:

1. Enter a valid username into the username field.
2. Enter a valid password into the password field.
3. Tap the Login button.
4. Verify that the Dashboard screen is displayed.

Correct output MUST contain FOUR flow steps:

1. input username
2. input password
3. tap Login
4. assert Dashboard

NEVER return only the tap step.

The number of returned flow steps MUST always equal the number of test case steps.
`;
}

function normalizeInput(
    testCase,
    context,
) {
    if (
        !testCase ||
        typeof testCase !==
            "object"
    ) {
        throw new Error(
            "testCase is required.",
        );
    }

    if (
        !context ||
        typeof context !==
            "object"
    ) {
        throw new Error(
            "context is required.",
        );
    }

    if (
        typeof testCase.id !==
        "string" ||
        !testCase.id.trim()
    ) {
        throw new Error(
            "testCase.id is required.",
        );
    }

    if (
        !Array.isArray(
            testCase.steps,
        ) ||
        testCase.steps.length === 0
    ) {
        throw new Error(
            "testCase.steps must contain at least one step.",
        );
    }

    return {
        testCase,
        context,
    };
}

function inferAssertionValues(
    step,
    sourceStep,
) {
    if (
        !step ||
        step.action !==
            "assert"
    ) {
        return step;
    }

    if (
        step.actual &&
        step.operator &&
        step.expected
    ) {
        return step;
    }

    const sourceText =
        [
            sourceStep?.action,
            sourceStep?.expected,
        ]
            .filter(
                (value) =>
                    typeof value ===
                    "string",
            )
            .join(" ")
            .trim();

    const normalizedText =
        sourceText.toLowerCase();

    /*
     * Dashboard / screen visibility
     */
    const dashboardMatch =
        sourceText.match(
            /\bDashboard\b/i,
        );

    if (
        dashboardMatch
    ) {
        return {
            ...step,

            locatorStrategy:
                null,

            locator:
                null,

            actual:
                "Dashboard",

            operator:
                "contains",

            expected:
                "Dashboard",
        };
    }

    /*
     * Generic "is displayed / visible"
     */
    if (
        normalizedText.includes(
            "displayed",
        ) ||
        normalizedText.includes(
            "visible",
        ) ||
        normalizedText.includes(
            "terlihat",
        ) ||
        normalizedText.includes(
            "ditampilkan",
        )
    ) {
        const cleaned =
            sourceText
                .replace(
                    /\bverify\b/gi,
                    "",
                )
                .replace(
                    /\bthat\b/gi,
                    "",
                )
                .replace(
                    /\bis\s+displayed\b/gi,
                    "",
                )
                .replace(
                    /\bis\s+visible\b/gi,
                    "",
                )
                .replace(
                    /\bditampilkan\b/gi,
                    "",
                )
                .trim();

        if (cleaned) {
            return {
                ...step,

                locatorStrategy:
                    null,

                locator:
                    null,

                actual:
                    cleaned,

                operator:
                    "contains",

                expected:
                    cleaned,
            };
        }
    }

    return step;
}

export async function convertTestCaseToFlow(
    testCase,
    context,
) {
    const input =
        normalizeInput(
            testCase,
            context,
        );

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
                                buildSystemPrompt(),
                        },

                        {
                            role:
                                "user",

                            content:
                                JSON.stringify(
                                    input,
                                ),
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
            `Ollama flow conversion request failed (${response.status}): ${errorText}`,
        );
    }

    const data =
        await response.json();

    const rawContent =
    data?.message?.content ??
    data?.response ??
    data?.content;

let parsed;

if (
    typeof rawContent ===
    "string"
) {
    try {
        parsed =
            JSON.parse(
                rawContent,
            );
    } catch {
        throw new Error(
            `Ollama returned invalid flow conversion JSON: ${rawContent}`,
        );
    }
} else if (
    rawContent &&
    typeof rawContent ===
        "object"
) {
    parsed =
        rawContent;
} else {
    throw new Error(
        "Ollama returned an invalid flow conversion message.",
    );
}

console.log(
    "[AI Test Case Flow] Parsed Ollama response:",
    JSON.stringify(
        parsed,
        null,
        2,
    ),
);

const normalizedPayload =
    {
        ...parsed,

        flowPlan: {
            ...parsed.flowPlan,

            steps:
                Array.isArray(
                    parsed.flowPlan?.steps,
                )
                    ? parsed.flowPlan.steps.map(
                        (
                            step,
                            index,
                        ) =>
                            inferAssertionValues(
                                step,
                                input.testCase
                                    .steps[index],
                            ),
                    )
                    : [],
        },
    };

const result =
    normalizeTestCaseFlowResponse(
        normalizedPayload,
        input.testCase.id,
        input.testCase.steps.length,
    );

if (!result) {
    throw new Error(
        `Ollama returned an invalid test-case flow plan. Expected ${input.testCase.steps.length} flow step(s).`,
    );
}

return result;
}