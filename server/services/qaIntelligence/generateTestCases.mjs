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

function normalizeStep(
    step,
    index,
) {
    return {
        order:
            Number.isInteger(
                step?.order,
            )
                ? step.order
                : index + 1,

        action:
            typeof step?.action ===
            "string"
                ? step.action.trim()
                : "",

        ...(typeof step?.testData ===
        "string"
            ? {
                testData:
                    step.testData.trim(),
            }
            : {}),

        ...(typeof step?.expected ===
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

    const steps = Array.isArray(
        testCase.steps,
    )
        ? testCase.steps
              .map(
                  normalizeStep,
              )
              .filter(
                  (step) =>
                      step.action
                          .length >
                      0,
              )
        : [];

    const preconditions =
        Array.isArray(
            testCase.preconditions,
        )
            ? testCase.preconditions
                  .filter(
                      (item) =>
                          typeof item ===
                          "string",
                  )
                  .map(
                      (item) =>
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
                  ).padStart(3, "0")}`,

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
                  .filter(Boolean)
            : [];

    if (
        testCases.length === 0
    ) {
        return null;
    }

    return {
        requirement:
            requirement.trim(),

        testCases,
    };
}