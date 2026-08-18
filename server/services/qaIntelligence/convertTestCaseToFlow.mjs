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

==================================================
CURRENT FLOW PREREQUISITES
==================================================

The input context contains the CURRENT FlowTest Studio graph.

The graph is represented by:

- context.nodes
- context.edges
- each node has an existing "id"
- each node has action, title, subtitle, locatorStrategy,
  locator, and optional details
- edges define the actual execution order

The current graph may already contain navigation actions required
to reach the application state needed by the approved test case.

Example:

Launch App
→ Catalog
→ Tap Menu
→ Tap Login
→ Login Screen

If the approved test case requires navigation through existing
nodes before its own test-case steps can execute, you MUST return
those existing node IDs in:

"prerequisiteNodeIds": []

IMPORTANT:
For this situation, "prerequisiteNodeIds" MUST NOT be an empty
array.

RULES:

1. Use ONLY node IDs that exist in context.nodes.

2. NEVER invent node IDs.

3. Use context.edges to follow the real graph order.

4. Preserve the exact graph order in prerequisiteNodeIds.

5. Existing prerequisite nodes do NOT count as flowPlan.steps.

CRITICAL SEPARATION RULE:

- context.nodes and context.edges are ONLY for determining prerequisiteNodeIds.
- NEVER copy context.nodes into flowPlan.steps.
- NEVER use an existing context node ID as a generated flow step ID.
- NEVER use a prerequisite node's action, title, subtitle, or locator as a substitute for a test-case step.
- flowPlan.steps MUST represent the approved testCase.steps ONLY.
- Every flowPlan.steps item must correspond to the testCase step at the same sourceStepOrder.
- The generated step ID must be a new AI step ID such as "ai-step-1", "ai-step-2", etc.
- Existing IDs from context.nodes such as launchApp, menu, or login-navigation nodes MUST NOT appear as flowPlan.steps IDs.

6. flowPlan.steps MUST remain exactly one-to-one with the
   approved test case steps.

7. Do NOT recreate an existing prerequisite as a new step.

8. Prefer the shortest valid existing path from the application
   start state to the state required by the test case.

9. Launch App is the application bootstrap.
   It may be referenced in prerequisiteNodeIds when it is part
   of the required path.

10. For a login test starting from an application Catalog screen,
    if the current graph contains an existing Menu action followed
    by an existing Login navigation action, prerequisiteNodeIds
    MUST reference those existing node IDs.

11. For the login example:

    Current graph:
    Launch App
    → Catalog
    → Menu
    → Login

    Test case:
    Input username
    Input password
    Press Return
    Tap Login
    Assert Dashboard

    Correct flowPlan structure:

    "prerequisiteNodeIds": [
      "<Launch App node id>",
      "<Menu node id>",
      "<Login navigation node id>"
    ]

   "steps": [
  {
    "id": "ai-step-1",
    "sourceStepOrder": 1,
    "action": "input",
    "title": "Input username",
    "description": "Enter a valid username into the username field",
    "semanticTarget": "username"
  },
  {
    "id": "ai-step-2",
    "sourceStepOrder": 2,
    "action": "input",
    "title": "Input password",
    "description": "Enter a valid password into the password field",
    "semanticTarget": "password"
  },
  {
    "id": "ai-step-3",
    "sourceStepOrder": 3,
    "action": "pressReturn",
    "title": "Press Return",
    "description": "Dismiss the iOS keyboard",
    "semanticTarget": null,
    "locatorStrategy": null,
    "locator": null
  },
  {
    "id": "ai-step-4",
    "sourceStepOrder": 4,
    "action": "tap",
    "title": "Tap Login",
    "description": "Tap the Login button",
    "semanticTarget": "login"
  },
  {
    "id": "ai-step-5",
    "sourceStepOrder": 5,
    "action": "assert",
    "title": "Assert Dashboard",
    "description": "Verify that the Dashboard screen is displayed",
    "semanticTarget": "dashboard"
  }
]

12. Do NOT put Menu or Login navigation into flowPlan.steps.

13. If the current graph is already at the required test state,
    return:
    "prerequisiteNodeIds": []

The prerequisite path is execution context.
It is NOT part of the test-case step count.

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
- pressReturn

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
    "prerequisiteNodeIds": [
      "existing-node-id"
    ],
    "steps": [
      {
        "id": "string",
        "sourceStepOrder": 1,
        "action": "tap | input | assert | delay | wait | pressReturn",
        "title": "string",
        "description": "string",
        "semanticTarget": "string | null",
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

For locator-based actions:

- semanticTarget MUST represent the human-readable target element.
- semanticTarget MUST NOT be a generic UI class name.
- Do not use values such as:
  XCUIElementTypeTextField
  XCUIElementTypeSecureTextField
  XCUIElementTypeButton
  android.widget.EditText
  android.widget.Button

Examples:

"Enter a valid username into the username field."
→ semanticTarget = "username"

"Enter a valid password into the password field."
→ semanticTarget = "password"

"Tap the Login button."
→ semanticTarget = "login"

==================================================
CONTEXT RULES
==================================================

- The current FlowTest Studio context is the source of truth.

- Inspect context.nodes AND context.edges before generating
  prerequisiteNodeIds.

- Prefer an existing node when it represents the same semantic
  action required by the test.

- Never invent an existing node ID.

- Prefer existing navigation nodes for prerequisites.

- Do not copy an unrelated locator merely because it belongs to
  an existing node.

- semanticTarget is the semantic identity of the requested
  element.

- For login:
  semanticTarget = "login"

- "login" must never refer to:
  - logout
  - LogOut-menu-item
  - unrelated menu items

- For username:
  semanticTarget = "username"

- For password:
  semanticTarget = "password"

- If an existing node has an unrelated locator, do not treat that
  locator as proof that it is the requested target.

- Preserve test data from the original test case.

- Preconditions are context information and should not become
  additional test-case steps.

- expectedResult is context information and must not become an
  additional flow step.

- Only explicit test-case steps determine flowPlan.steps.

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

11. For the login example:

    Current graph:
    Launch App
    → Catalog
    → Menu
    → Login

    Test case:
    Input username
    Input password
    Tap Login
    Assert Dashboard

    Correct flowPlan structure:

    "prerequisiteNodeIds": [
      "<Launch App node id>",
      "<Menu node id>",
      "<Login navigation node id>"
    ]

    "steps": [
      {
        "id": "ai-step-1",
        "sourceStepOrder": 1,
        "action": "input",
        "title": "Input username",
        "description": "Enter a valid username into the username field",
        "semanticTarget": "username"
      },
      {
        "id": "ai-step-2",
        "sourceStepOrder": 2,
        "action": "input",
        "title": "Input password",
        "description": "Enter a valid password into the password field",
        "semanticTarget": "password"
      },
      {
        "id": "ai-step-3",
        "sourceStepOrder": 3,
        "action": "tap",
        "title": "Tap Login",
        "description": "Tap the Login button",
        "semanticTarget": "login"
      },
      {
        "id": "ai-step-4",
        "sourceStepOrder": 4,
        "action": "assert",
        "title": "Assert Dashboard",
        "description": "Verify that the Dashboard screen is displayed",
        "semanticTarget": "dashboard"
      }
    ]
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

function deriveSemanticTarget(
    step,
) {
    if (
        typeof step.semanticTarget ===
            "string" &&
        step.semanticTarget.trim()
    ) {
        return step.semanticTarget
            .trim()
            .toLowerCase();
    }

    const source =
        [
            step.title,
            step.description,
            step.locator,
        ]
            .filter(
                (value) =>
                    typeof value ===
                    "string",
            )
            .join(" ")
            .toLowerCase();

    if (
        /\busername\b/.test(
            source,
        )
    ) {
        return "username";
    }

    if (
        /\bpassword\b/.test(
            source,
        )
    ) {
        return "password";
    }

    if (
        /\blogin\b/.test(
            source,
        )
    ) {
        return "login";
    }

    if (
        /\bdashboard\b/.test(
            source,
        )
    ) {
        return "dashboard";
    }

    return null;
}

function normalizeGeneratedFlowSteps(
    steps,
) {
    return steps.map(
        (
            step,
            index,
        ) => {
            const sourceStepOrder =
                index + 1;

            const semanticTarget =
                deriveSemanticTarget(
                    step,
                );

            if (
                step.action ===
                "assert"
            ) {

            if (
    step.action ===
    "pressReturn"
) {
    return {
        ...step,

        id:
            `ai-step-${sourceStepOrder}`,

        sourceStepOrder,

        semanticTarget:
            null,

        locatorStrategy:
            null,

        locator:
            null,

        text:
            null,

        duration:
            null,

        actual:
            null,

        operator:
            null,

        expected:
            null,

        timeout:
            null,

        pollingInterval:
            null,
    };
}
                return {
                    ...step,

                    id:
                        `ai-step-${sourceStepOrder}`,

                    sourceStepOrder,

                    semanticTarget,

                    locatorStrategy:
                        null,

                    locator:
                        null,
                };
            }

            if (
    semanticTarget
) {
    return {
        ...step,

        id:
            `ai-step-${sourceStepOrder}`,

        sourceStepOrder,

        semanticTarget,

        locatorStrategy:
            "accessibilityId",

        locator:
            semanticTarget,
    };
}

            return {
                ...step,

                id:
                    `ai-step-${sourceStepOrder}`,

                sourceStepOrder,

                semanticTarget:
                    null,
            };
        },
    );
}

function getNodeSearchText(
    node,
) {
    return [
        node?.action,
        node?.title,
        node?.subtitle,
        node?.locator,
    ]
        .filter(
            (
                value,
            ) =>
                typeof value ===
                "string",
        )
        .join(" ")
        .toLowerCase();
}

function findNodeBySemanticTarget(
    nodes,
    target,
) {
    const normalizedTarget =
        target
            .trim()
            .toLowerCase();

    return nodes.find(
        (
            node,
        ) => {
            const text =
                getNodeSearchText(
                    node,
                );

            if (
                normalizedTarget ===
                "login"
            ) {
                return (
                    /\blogin\b/.test(
                        text,
                    ) &&
                    !/\blogout\b/.test(
                        text,
                    ) &&
                    !/logout-menu-item/.test(
                        text,
                    )
                );
            }

            return text.includes(
                normalizedTarget,
            );
        },
    );
}

function buildPrerequisitePath(
    context,
    targetNodeId,
) {
    const nodes =
        Array.isArray(
            context?.nodes,
        )
            ? context.nodes
            : [];

    const edges =
        Array.isArray(
            context?.edges,
        )
            ? context.edges
            : [];

    if (
        nodes.length ===
        0 ||
        !targetNodeId
    ) {
        return [];
    }

    const incoming =
        new Map();

    for (
        const edge of
        edges
    ) {
        if (
            !incoming.has(
                edge.target,
            )
        ) {
            incoming.set(
                edge.target,
                [],
            );
        }

        incoming
            .get(
                edge.target,
            )
            .push(
                edge.source,
            );
    }

    const launchAppNode =
        nodes.find(
            (
                node,
            ) =>
                node?.action ===
                "launchApp",
        );

    if (
        !launchAppNode
    ) {
        return [];
    }

    const queue = [
        targetNodeId,
    ];

    const parent =
        new Map();

    const visited =
        new Set([
            targetNodeId,
        ]);

    let foundStart = false;

    while (
        queue.length >
        0
    ) {
        const current =
            queue.shift();

        if (
            current ===
            launchAppNode.id
        ) {
            foundStart = true;
            break;
        }

        const sources =
            incoming.get(
                current,
            ) ?? [];

        for (
            const source of
            sources
        ) {
            if (
                visited.has(
                    source,
                )
            ) {
                continue;
            }

            visited.add(
                source,
            );

            parent.set(
                source,
                current,
            );

            queue.push(
                source,
            );
        }
    }

    if (
        !foundStart
    ) {
        return [];
    }

    const path = [];

    let current =
        launchAppNode.id;

    path.push(
        current,
    );

    while (
        current !==
        targetNodeId
    ) {
        const next =
            parent.get(
                current,
            );

        if (!next) {
            return [];
        }

        path.push(
            next,
        );

        current =
            next;
    }

    return path;
}

function buildLoginPrerequisitePath(
    context,
    targetNodeId,
) {
    const nodes =
        Array.isArray(
            context?.nodes,
        )
            ? context.nodes
            : [];

    const edges =
        Array.isArray(
            context?.edges,
        )
            ? context.edges
            : [];

    if (
        nodes.length === 0 ||
        !targetNodeId
    ) {
        return [];
    }

    const launchAppNode =
        nodes.find(
            (
                node,
            ) =>
                node?.action ===
                "launchApp",
        );

    if (
        !launchAppNode
    ) {
        return [];
    }

    const outgoing =
        new Map();

    for (
        const edge of
        edges
    ) {
        if (
            !outgoing.has(
                edge.source,
            )
        ) {
            outgoing.set(
                edge.source,
                [],
            );
        }

        outgoing
            .get(
                edge.source,
            )
            .push(
                edge.target,
            );
    }

    const queue = [
        launchAppNode.id,
    ];

    const parent =
        new Map();

    const visited =
        new Set([
            launchAppNode.id,
        ]);

    while (
        queue.length >
        0
    ) {
        const current =
            queue.shift();

        if (
            current ===
            targetNodeId
        ) {
            break;
        }

        const targets =
            outgoing.get(
                current,
            ) ?? [];

        for (
            const target of
            targets
        ) {
            if (
                visited.has(
                    target,
                )
            ) {
                continue;
            }

            visited.add(
                target,
            );

            parent.set(
                target,
                current,
            );

            queue.push(
                target,
            );
        }
    }

    if (
        !visited.has(
            targetNodeId,
        )
    ) {
        return [];
    }

    const path = [];

    let current =
        targetNodeId;

    while (
        current !==
        launchAppNode.id
    ) {
        path.unshift(
            current,
        );

        current =
            parent.get(
                current,
            );

        if (
            !current
        ) {
            return [];
        }
    }

    path.unshift(
        launchAppNode.id,
    );

    return path;
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


        console.log(
    "[AI Test Case Flow] Context nodes received:",
    JSON.stringify(
        input.context?.nodes,
        null,
        2,
    ),
);

console.log(
    "[AI Test Case Flow] Context edges received:",
    JSON.stringify(
        input.context?.edges,
        null,
        2,
    ),
);

    const expectedStepCount =
        input.testCase.steps.length;

    const response =
        await fetch(
            `${baseUrl}/api/chat`,
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    model,

                    stream:
                        false,

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

                        num_predict:
                            2048,
                    },

                    think:
                        false,
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

    if (
        typeof rawContent ===
            "string" &&
        !rawContent.trim()
    ) {
        console.error(
            "[AI Test Case Flow] Ollama returned an empty response:",
            JSON.stringify(
                data,
                null,
                2,
            ),
        );

        throw new Error(
            "Ollama returned an empty flow conversion response.",
        );
    }

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
    const inferredSteps =
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

    const normalizedSteps =
        normalizeGeneratedFlowSteps(
            inferredSteps,
        );

    function normalizeSourceAction(
    action,
) {
    return typeof action ===
        "string"
        ? action
            .trim()
            .toLowerCase()
        : "";
}

function isSourceStepCompatible(
    sourceStep,
    generatedStep,
) {
    const source =
        normalizeSourceAction(
            sourceStep?.action,
        );

    const action =
        normalizeSourceAction(
            generatedStep?.action,
        );

    if (
        !source ||
        !action
    ) {
        return false;
    }

    /*
     * Input
     */
    if (
        /\b(enter|input|type|fill|isi|masukkan)\b/.test(
            source,
        )
    ) {
        return action ===
            "input";
    }

    /*
     * Press Return
     */
    if (
    /\bpress\s+return\b/.test(
        source,
    ) ||
    /\breturn\s+key\b/.test(
        source,
    ) ||
    /\bdismiss\s+the\s+keyboard\b/.test(
        source,
    ) ||
    /\btekan\s+return\b/.test(
        source,
    ) ||
    /\btutup\s+keyboard\b/.test(
        source,
    ) ||
    /\bsembunyikan\s+keyboard\b/.test(
        source,
    )
) {
    return (
        action ===
        "pressreturn"
    );
}

    /*
     * Tap / click
     */
    if (
        /\b(tap|click|press|select)\b/.test(
            source,
        )
    ) {
        return action ===
            "tap";
    }

    /*
     * Assertion / verification
     */
    if (
        /\b(verify|assert|check|confirm|displayed|visible)\b/.test(
            source,
        )
    ) {
        return action ===
            "assert";
    }

    /*
     * Delay
     */
    if (
        /\b(wait|delay)\b/.test(
            source,
        )
    ) {
        return (
            action ===
                "wait" ||
            action ===
                "delay"
        );
    }

    /*
     * Unknown natural-language source:
     * don't reject purely based on action text.
     */
    return true;
}

    const modelPrerequisiteNodeIds =
        Array.isArray(
            parsed.flowPlan?.prerequisiteNodeIds,
        )
            ? parsed.flowPlan.prerequisiteNodeIds
                .filter(
                    (
                        nodeId,
                    ) =>
                        typeof nodeId ===
                            "string" &&
                        nodeId.trim(),
                )
                .map(
                    (
                        nodeId,
                    ) =>
                        nodeId.trim(),
                )
            : [];

    let prerequisiteNodeIds =
        modelPrerequisiteNodeIds;

    /*
     * Fail early when Ollama returned an
     * unexpected number of flow steps.
     *
     * This validation must happen before any
     * prerequisite inference so malformed
     * partial plans still produce the expected
     * step-count error.
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

    const contextNodeIds =
    new Set(
        Array.isArray(
            input.context?.nodes,
        )
            ? input.context.nodes
                .map(
                    (
                        node,
                    ) =>
                        node?.id,
                )
                .filter(
                    (
                        id,
                    ) =>
                        typeof id ===
                        "string" &&
                        id.trim(),
                )
            : [],
    );

    const invalidGeneratedStep =
    normalizedSteps.find(
        (
            step,
            index,
        ) => {
            /*
             * Existing graph node IDs must never
             * become generated flow-step IDs.
             */
            if (
                contextNodeIds.has(
                    step.id,
                )
            ) {
                return true;
            }

            /*
             * Each generated step must map to
             * the corresponding source test step.
             */
            const sourceStep =
                input.testCase.steps[
                    index
                ];

            return (
                !isSourceStepCompatible(
                    sourceStep,
                    step,
                )
            );
        },
    );

if (
    invalidGeneratedStep
) {
    const invalidIndex =
        normalizedSteps.indexOf(
            invalidGeneratedStep,
        );

    const sourceStep =
        input.testCase.steps[
            invalidIndex
        ];

    throw new Error(
        `Ollama generated a flow step that does not correspond to test-case step ${invalidIndex + 1}: "${sourceStep?.action ?? "unknown"}".`,
    );
}

    const hasLoginStep =
        normalizedSteps.some(
            (
                step,
            ) =>
                step.semanticTarget ===
                    "login" ||
                /\blogin\b/i.test(
                    step.title ??
                    "",
                ),
        );

    /*
     * For login flows, derive the prerequisite
     * path from the real FlowTest Studio graph
     * instead of trusting Ollama to select every
     * prerequisite node correctly.
     */
    if (
    hasLoginStep
) {
    const loginNavigationNode =
        findNodeBySemanticTarget(
            input.context?.nodes,
            "login",
        );

    if (
        loginNavigationNode
    ) {
        const deterministicPath =
            buildLoginPrerequisitePath(
                input.context,
                loginNavigationNode.id,
            );

        if (
            deterministicPath.length >
            0
        ) {
            prerequisiteNodeIds =
                deterministicPath;
        }
    }
}

    console.log(
    "[AI Test Case Flow] Deterministic prerequisite:",
    {
        modelPrerequisiteNodeIds,
        prerequisiteNodeIds,
        loginNavigationNodeId:
            findNodeBySemanticTarget(
                input.context?.nodes,
                "login",
            )?.id ?? null,
        prerequisiteNodes:
            prerequisiteNodeIds.map(
                (
                    nodeId,
                ) =>
                    input.context?.nodes?.find(
                        (
                            node,
                        ) =>
                            node.id ===
                            nodeId,
                    ),
            ).map(
                (
                    node,
                ) =>
                    node
                        ? {
                            id:
                                node.id,
                            action:
                                node.action,
                            title:
                                node.title,
                            subtitle:
                                node.subtitle,
                            locator:
                                node.locator,
                        }
                        : null,
            ),
    },
);

    const invalidPrerequisiteNodeIds =
        prerequisiteNodeIds.filter(
            (
                nodeId,
            ) =>
                !contextNodeIds.has(
                    nodeId,
                ),
        );

    /*
     * If the current graph clearly contains
     * login navigation but no valid prerequisite
     * path was returned, fail early instead of
     * trying to resolve locators on the wrong
     * application screen.
     */
    const hasPrerequisites =
        prerequisiteNodeIds.length >
        0;

    if (
        hasLoginStep &&
        Array.isArray(
            input.context?.nodes,
        ) &&
        input.context.nodes.length >
            0 &&
        !hasPrerequisites
    ) {
        const hasLaunchAppNode =
            input.context.nodes.some(
                (
                    node,
                ) =>
                    node?.action ===
                    "launchApp",
            );

        const hasNavigationNodes =
            input.context.nodes.some(
                (
                    node,
                ) =>
                    node?.action ===
                        "tap" &&
                    /\b(menu|login)\b/i.test(
                        [
                            node.title,
                            node.subtitle,
                            node.locator,
                        ]
                            .filter(
                                (
                                    value,
                                ) =>
                                    typeof value ===
                                    "string",
                            )
                            .join(" "),
                    ),
            );

        if (
            hasLaunchAppNode &&
            hasNavigationNodes
        ) {
            throw new Error(
                "Ollama returned no prerequisiteNodeIds for a login flow even though the current flow contains existing navigation nodes.",
            );
        }
    }

    if (
        invalidPrerequisiteNodeIds.length >
        0
    ) {
        throw new Error(
            `Ollama returned invalid prerequisite node ID(s): ${invalidPrerequisiteNodeIds.join(
                ", ",
            )}.`,
        );
    }

    /*
     * Build the final normalized payload only
     * after deterministic prerequisite inference
     * has completed.
     */
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

                prerequisiteNodeIds,

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

        console.log(
    "[AI Test Case Flow] Final normalized flow plan:",
    JSON.stringify(
        normalizedPayload.flowPlan,
        null,
        2,
    ),
);

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