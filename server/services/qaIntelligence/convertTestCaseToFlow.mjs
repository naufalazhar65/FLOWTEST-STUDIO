import {
    normalizeTestCaseFlowResponse,
} from "./normalizeTestCaseFlow.mjs";

const baseUrl =
    process.env.OLLAMA_BASE_URL ??
    "http://localhost:11434";

const model =
    process.env.OLLAMA_MODEL ??
    "qwen3:1.7b";

function buildSystemPrompt(
    expectedStepCount,
) {
    return `
You are the Test Case to Flow conversion engine for FlowTest Studio.

Your job is to convert ONE approved QA test case into an executable FlowTest Studio flow plan.

==================================================
ABSOLUTE STEP COUNT RULE
==================================================

The input test case contains EXACTLY ${expectedStepCount} step(s).

The output flowPlan.steps MUST contain EXACTLY ${expectedStepCount} step(s).

This is a hard constraint.

NEVER output fewer than ${expectedStepCount} steps.
NEVER output more than ${expectedStepCount} steps.

The number of output flow steps MUST equal the number
of input test case steps.

==================================================
STRICT 1:1 MAPPING
==================================================

Every test case step maps to exactly ONE flow step.

1 input test step = 1 flow step.

Never:
- skip a test case step
- merge multiple test case steps
- split one test case step
- invent an additional step
- infer additional actions
- expand a test step into multiple actions
- create extra login steps
- create extra assertions
- create extra waits
- create extra inputs
- create extra taps

The test case steps are the ONLY source of truth for the
number and order of output flow steps.

Preserve the original order.

sourceStepOrder MUST contain:

1, 2, 3, ... ${expectedStepCount}

and every number MUST appear exactly once.

==================================================
SUPPORTED ACTIONS
==================================================

Supported executable actions:

- tap
- input
- assert
- delay
- wait

If a test step describes a supported action, convert that
single step into exactly one corresponding flow step.

==================================================
IMPORTANT ASSERTION RULE
==================================================

An assertion is ONE flow step.

Do NOT create an additional tap, wait, or getText step
for an assertion.

For example:

"Verify that the Dashboard screen is displayed."

MUST become exactly ONE assert step:

{
  "action": "assert",
  "actual": "Dashboard",
  "operator": "contains",
  "expected": "Dashboard"
}

NOT:

tap Dashboard
+
wait Dashboard
+
assert Dashboard

==================================================
IMPORTANT INPUT RULE
==================================================

An input test step is ONE flow step.

For example:

"Enter a valid username into the username field."

MUST become exactly ONE input step.

Do NOT add a separate focus, tap, wait, or assertion step.

==================================================
IMPORTANT TAP RULE
==================================================

A tap test step is ONE flow step.

For example:

"Tap the Login button."

MUST become exactly ONE tap step.

==================================================
OUTPUT FORMAT
==================================================

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

==================================================
FIELD RULES
==================================================

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

For delay:
- duration must be positive.

For wait:
- locatorStrategy is required.
- locator is required.
- timeout must be positive.
- pollingInterval must be positive.

==================================================
CONTEXT RULES
==================================================

- Prefer locators from the current FlowTest Studio context when
  an existing node represents the same target.
- If the target is explicitly named in the test step,
  derive a reasonable locator from that target.
- Prefer accessibilityId when the target name naturally maps
  to an accessibility identifier.
- Do not invent unrelated application elements.
- Preserve test data from the original test case.
- Preconditions are context information and should not become
  extra flow steps.
- expectedResult is context information and MUST NOT become
  an additional flow step.
- Only convert explicit test-case steps.
- Return no explanation or markdown.

==================================================
FINAL VALIDATION BEFORE RESPONSE
==================================================

Before returning JSON, verify:

1. steps.length === ${expectedStepCount}
2. sourceStepOrder contains every value from
   1 through ${expectedStepCount}
3. No duplicate sourceStepOrder values exist.
4. No step was added.
5. No step was removed.
6. No step was split.
7. No step was merged.

If the input contains ${expectedStepCount} steps,
you MUST return exactly ${expectedStepCount} flow steps.

==================================================
EXAMPLE
==================================================

Input:

1. Enter a valid username into the username field.
2. Enter a valid password into the password field.
3. Tap the Login button.
4. Verify that the Dashboard screen is displayed.

Correct output:

1. input username
2. input password
3. tap Login
4. assert Dashboard

Exactly FOUR flow steps.

NEVER return only the tap step.
NEVER add an extra step.

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
        testCase.steps.length ===
            0
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

    const expectedStepCount =
        input.testCase.steps.length;

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
                                buildSystemPrompt(
                                    expectedStepCount,
                                ),
                        },

                        {
                            role:
                                "user",

                            content:
                                JSON.stringify(
                                    {
                                        ...input,

                                        expectedStepCount,
                                    },
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

    if (
        !response.ok
    ) {
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
        "[AI Test Case Flow] Expected step count:",
        expectedStepCount,
    );

    console.log(
        "[AI Test Case Flow] Parsed Ollama response:",
        JSON.stringify(
            parsed,
            null,
            2,
        ),
    );

    const rawFlowSteps =
    Array.isArray(
        parsed.flowPlan?.steps,
    )
        ? parsed.flowPlan.steps
        : [];

const rawTestCaseSteps =
    Array.isArray(
        parsed.testCase?.steps,
    )
        ? parsed.testCase.steps
        : [];

const rawSteps =
    rawFlowSteps.length >
    0
        ? rawFlowSteps
        : rawTestCaseSteps.map(
            (
                step,
                index,
            ) => ({
                ...step,

                id:
                    typeof step.id ===
                    "string" &&
                    step.id.trim()
                        ? step.id
                        : `step-${index + 1}`,

                sourceStepOrder:
                    Number.isInteger(
                        step.sourceStepOrder,
                    )
                        ? step.sourceStepOrder
                        : Number.isInteger(
                            step.order,
                        )
                            ? step.order
                            : index + 1,
            }),
        );

    /*
     * Keep assertion inference one-to-one
     * with the original test-case step order.
     */
    const normalizedSteps =
        rawSteps.map(
            (
                step,
                index,
            ) =>
                inferAssertionValues(
                    step,
                    input.testCase
                        .steps[index],
                ),
        );

    const normalizedPayload =
    {
        ...parsed,

        testCaseId:
            parsed.testCaseId ??
            parsed.testCase?.id ??
            input.testCase.id,

        flowPlan: {
            type:
                "flow_plan",

            summary:
                parsed.flowPlan?.summary ??
                parsed.testCase?.title ??
                input.testCase.title ??
                "Generated flow plan.",

            steps:
                normalizedSteps,

            warnings:
                Array.isArray(
                    parsed.flowPlan?.warnings,
                )
                    ? parsed.flowPlan.warnings
                    : [],
        },
    };

    /*
     * Fail early when Ollama returned an
     * unexpected number of flow steps.
     */
    if (
        normalizedSteps.length !==
        expectedStepCount
    ) {
        console.error(
            "[AI Test Case Flow] Step count mismatch:",
            {
                expected:
                    expectedStepCount,

                received:
                    normalizedSteps.length,

                sourceSteps:
                    input.testCase.steps,

                generatedSteps:
                    normalizedSteps,
            },
        );

        throw new Error(
            `Ollama returned ${normalizedSteps.length} flow step(s), but ${expectedStepCount} test-case step(s) were expected.`,
        );
    }

    const result =
        normalizeTestCaseFlowResponse(
            normalizedPayload,
            input.testCase.id,
            expectedStepCount,
        );

    if (!result) {
        throw new Error(
            `Ollama returned an invalid test-case flow plan. Expected ${expectedStepCount} flow step(s).`,
        );
    }

    return result;
}