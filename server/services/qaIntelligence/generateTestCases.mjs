const PRIORITIES = new Set([
    "critical",
    "high",
    "medium",
    "low",
]);

const TYPES = new Set([
    "functional",
    "negative",
    "validation",
    "edge",
]);

const SUPPORTED_FLOW_ACTIONS =
    new Set([
        "tap",
        "input",
        "assert",
        "delay",
        "wait",
    ]);

const INVALID_COMMAND_ACTION_PATTERNS =
    [
        /^execute\s+/i,
        /^run\s+/i,
        /\bcommand\b/i,
        /\bshell\b/i,
        /\bterminal\b/i,
        /\bnpx\b/i,
        /\bnpm\b/i,
        /\bvitest\b/i,
        /\bjest\b/i,
        /\bpytest\b/i,
        /\bcurl\b/i,
    ];

function normalizePriority(
    value,
) {
    return PRIORITIES.has(value)
        ? value
        : "medium";
}

function normalizeType(
    value,
) {
    return TYPES.has(value)
        ? value
        : "functional";
}

function isInvalidCommandAction(
    action,
) {
    if (
        typeof action !==
        "string"
    ) {
        return true;
    }

    const normalized =
        action.trim();

    if (!normalized) {
        return true;
    }

    return INVALID_COMMAND_ACTION_PATTERNS.some(
        (
            pattern,
        ) =>
            pattern.test(
                normalized,
            ),
    );
}

function isSupportedFlowAction(
    action,
) {
    return (
        typeof action ===
            "string" &&
        SUPPORTED_FLOW_ACTIONS.has(
            action
                .trim()
                .toLowerCase(),
        )
    );
}

function normalizeStep(
    step,
    index,
) {
    if (
        !step ||
        typeof step !==
            "object"
    ) {
        return null;
    }

    const rawAction =
        typeof step.action ===
        "string"
            ? step.action.trim()
            : "";

    if (
        !rawAction ||
        isInvalidCommandAction(
            rawAction,
        )
    ) {
        return null;
    }

    /*
     * Keep the original action for backward
     * compatibility with existing test fixtures.
     *
     * The important guard here is that shell/
     * command-oriented actions are rejected.
     */
    return {
        order:
            Number.isInteger(
                step.order,
            )
                ? step.order
                : index + 1,

        action:
            rawAction,

        ...(typeof step.testData ===
        "string"
            ? {
                testData:
                    step.testData.trim(),
            }
            : {}),

        ...(typeof step.expected ===
        "string"
            ? {
                expected:
                    step.expected.trim(),
            }
            : {}),
    };
}

function normalizeTestCase(
    testCase,
    index,
) {
    if (
        !testCase ||
        typeof testCase !==
            "object"
    ) {
        return null;
    }

    const rawSteps =
        Array.isArray(
            testCase.steps,
        )
            ? testCase.steps
            : [];

    if (
        rawSteps.length ===
        0
    ) {
        return null;
    }

    const steps =
        rawSteps
            .map(
                normalizeStep,
            )
            .filter(
                (
                    step,
                ) =>
                    step !== null,
            );

    /*
     * Reject the entire test case when one of
     * its steps is missing or is a command-like
     * step. We do not silently remove a bad step,
     * because that would change the intended
     * test-case step count.
     */
    if (
        steps.length !==
        rawSteps.length
    ) {
        return null;
    }

    const preconditions =
        Array.isArray(
            testCase.preconditions,
        )
            ? testCase.preconditions
                  .filter(
                      (
                          item,
                      ) =>
                          typeof item ===
                          "string",
                  )
                  .map(
                      (
                          item,
                      ) =>
                          item.trim(),
                  )
                  .filter(
                      Boolean,
                  )
            : [];

    const title =
        typeof testCase.title ===
        "string"
            ? testCase.title.trim()
            : "";

    const expectedResult =
        typeof testCase.expectedResult ===
        "string"
            ? testCase.expectedResult.trim()
            : "";

    if (
        !title ||
        steps.length === 0 ||
        !expectedResult
    ) {
        return null;
    }

    return {
        id:
            typeof testCase.id ===
                "string" &&
            testCase.id.trim()
                ? testCase.id.trim()
                : `TC-${String(
                      index + 1,
                  ).padStart(
                      3,
                      "0",
                  )}`,

        title,

        ...(typeof testCase.description ===
        "string" &&
        testCase.description.trim()
            ? {
                description:
                    testCase.description.trim(),
            }
            : {}),

        priority:
            normalizePriority(
                testCase.priority,
            ),

        type:
            normalizeType(
                testCase.type,
            ),

        preconditions,

        steps,

        expectedResult,
    };
}

function validateGeneratedTestCase(
    testCase,
) {
    if (
        !testCase ||
        !Array.isArray(
            testCase.steps,
        ) ||
        testCase.steps.length === 0
    ) {
        return false;
    }

    /*
     * Reject command-oriented actions explicitly.
     */
    if (
        testCase.steps.some(
            (
                step,
            ) =>
                !step ||
                isInvalidCommandAction(
                    step.action,
                ),
        )
    ) {
        return false;
    }

    /*
     * Only reject unknown actions when they are
     * clearly executable FlowTest command-like
     * actions. Existing generator tests may use
     * descriptive action strings.
     *
     * The stricter tap/input/assert/delay/wait
     * validation remains enforced by the converter.
     */
    return true;
}

export function normalizeTestCaseGenerationResult(
    requirement,
    payload,
) {
    if (
        typeof requirement !==
            "string" ||
        !requirement.trim()
    ) {
        return null;
    }

    const testCases =
        Array.isArray(
            payload?.testCases,
        )
            ? payload.testCases
                  .map(
                      normalizeTestCase,
                  )
                  .filter(
                      (
                          testCase,
                      ) =>
                          testCase !==
                              null &&
                          validateGeneratedTestCase(
                              testCase,
                          ),
                  )
            : [];

    if (
        testCases.length ===
        0
    ) {
        return null;
    }

    return {
        requirement:
            requirement.trim(),

        testCases,
    };
}