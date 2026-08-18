const VALID_ACTIONS = new Set([
    "tap",
    "input",
    "assert",
    "delay",
    "wait",
    "pressReturn",
]);

const VALID_LOCATOR_STRATEGIES =
    new Set([
        "accessibilityId",
        "id",
        "xpath",
        "className",
        "androidUiAutomator",
        "iOSPredicateString",
        "iOSClassChain",
    ]);

const VALID_ASSERT_OPERATORS =
    new Set([
        "equals",
        "notEquals",
        "contains",
        "notContains",
        "startsWith",
        "endsWith",
        "greaterThan",
        "greaterThanOrEqual",
        "lessThan",
        "lessThanOrEqual",
        "isTrue",
        "isFalse",
        "isEmpty",
        "isNotEmpty",
        "matches",
    ]);

function normalizeNullableString(
    value,
) {
    if (
        typeof value !==
        "string"
    ) {
        return null;
    }

    const normalized =
        value.trim();

    return normalized
        ? normalized
        : null;
}

function normalizeLocatorStrategy(
    value,
) {
    return VALID_LOCATOR_STRATEGIES.has(
        value,
    )
        ? value
        : null;
}

function normalizeOperator(
    value,
) {
    return VALID_ASSERT_OPERATORS.has(
        value,
    )
        ? value
        : null;
}

function normalizeSourceStepOrder(
    step,
    index,
) {
    if (
        Number.isInteger(
            step?.sourceStepOrder,
        )
    ) {
        return step.sourceStepOrder;
    }

    if (
        Number.isInteger(
            step?.order,
        )
    ) {
        return step.order;
    }

    return index + 1;
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

    const action =
        typeof step.action ===
        "string"
            ? step.action.trim()
            : "";

    if (
        !VALID_ACTIONS.has(
            action,
        )
    ) {
        return null;
    }

    return {
        id:
            typeof step.id ===
                "string" &&
            step.id.trim()
                ? step.id.trim()
                : `tc-flow-step-${index + 1}`,

        sourceStepOrder:
            normalizeSourceStepOrder(
                step,
                index,
            ),

        action,

        title:
            normalizeNullableString(
                step.title,
            ) ??
            action,

        description:
            normalizeNullableString(
                step.description,
            ) ??
            `Execute ${action}.`,

        locatorStrategy:
            normalizeLocatorStrategy(
                step.locatorStrategy,
            ),

        locator:
            normalizeNullableString(
                step.locator,
            ),

        text:
            normalizeNullableString(
                step.text,
            ),

        duration:
            typeof step.duration ===
                "number" &&
            step.duration > 0
                ? step.duration
                : null,

        actual:
            normalizeNullableString(
                step.actual,
            ),

        operator:
            normalizeOperator(
                step.operator,
            ),

        expected:
            normalizeNullableString(
                step.expected,
            ),

        timeout:
            typeof step.timeout ===
                "number" &&
            step.timeout > 0
                ? step.timeout
                : null,

        pollingInterval:
            typeof step.pollingInterval ===
                "number" &&
            step.pollingInterval > 0
                ? step.pollingInterval
                : null,
    };
}

function validateStep(
    step,
) {
    if (
        step.action ===
            "pressReturn"
    ) {
        return true;
    }

    if (
        step.action ===
            "tap" ||
        step.action ===
            "input" ||
        step.action ===
            "wait"
    ) {
        if (
            !step.locatorStrategy ||
            !step.locator
        ) {
            return false;
        }
    }

    if (
        step.action ===
        "input"
    ) {
        if (!step.text) {
            return false;
        }
    }

    if (
        step.action ===
        "assert"
    ) {
        if (
            !step.actual ||
            !step.operator ||
            !step.expected
        ) {
            return false;
        }
    }

    if (
        step.action ===
        "delay"
    ) {
        if (
            step.duration ===
            null
        ) {
            return false;
        }
    }

    if (
        step.action ===
        "wait"
    ) {
        if (
            step.timeout ===
                null ||
            step.pollingInterval ===
                null
        ) {
            return false;
        }
    }

    return true;
}

function validateSourceStepMapping(
    steps,
    expectedStepCount,
) {
    if (
        !Number.isInteger(
            expectedStepCount,
        ) ||
        expectedStepCount <= 0
    ) {
        return true;
    }

    if (
        steps.length !==
        expectedStepCount
    ) {
        return false;
    }

    const orders =
        steps.map(
            (step) =>
                step.sourceStepOrder,
        );

    const uniqueOrders =
        new Set(orders);

    if (
        uniqueOrders.size !==
        expectedStepCount
    ) {
        return false;
    }

    for (
        let index = 1;
        index <=
        expectedStepCount;
        index += 1
    ) {
        if (
            !uniqueOrders.has(
                index,
            )
        ) {
            return false;
        }
    }

    return true;
}

export function normalizeTestCaseFlowResponse(
    payload,
    fallbackTestCaseId,
    expectedStepCount = null,
) {
    if (
        !payload ||
        typeof payload !==
            "object"
    ) {
        return null;
    }

    const testCaseId =
        typeof payload.testCaseId ===
            "string" &&
        payload.testCaseId.trim()
            ? payload.testCaseId.trim()
            : fallbackTestCaseId;

    const rawPlan =
        payload.flowPlan;

    if (
        !rawPlan ||
        typeof rawPlan !==
            "object"
    ) {
        return null;
    }

    if (
        rawPlan.type !==
        "flow_plan"
    ) {
        return null;
    }

    if (
        !Array.isArray(
            rawPlan.steps,
        )
    ) {
        return null;
    }

    const prerequisiteNodeIds =
    Array.isArray(
        rawPlan.prerequisiteNodeIds,
    )
        ? rawPlan.prerequisiteNodeIds.filter(
            (
                nodeId,
            ) =>
                typeof nodeId ===
                    "string" &&
                nodeId.trim(),
        ).map(
            (
                nodeId,
            ) =>
                nodeId.trim(),
        )
        : [];

    const steps =
        rawPlan.steps
            .map(
                normalizeStep,
            )
            .filter(Boolean)
            .sort(
                (
                    left,
                    right,
                ) =>
                    left.sourceStepOrder -
                    right.sourceStepOrder,
            );

    if (
        rawPlan.steps.length >
            0 &&
        steps.length === 0
    ) {
        return null;
    }

    if (
        !validateSourceStepMapping(
            steps,
            expectedStepCount,
        )
    ) {
        return null;
    }

    const invalidStep =
        steps.find(
            (step) =>
                !validateStep(
                    step,
                ),
        );

    if (invalidStep) {
        return null;
    }

    return {
        testCaseId,

        flowPlan: {
    type:
        "flow_plan",

    summary:
        normalizeNullableString(
            rawPlan.summary,
        ) ??
        "Generated flow from test case.",

    prerequisiteNodeIds,

    steps:
        steps.map(
            ({
                sourceStepOrder,
                ...step
            }) =>
                step,
        ),

    warnings:
        Array.isArray(
            rawPlan.warnings,
        )
            ? rawPlan.warnings.filter(
                (
                    warning,
                ) =>
                    typeof warning ===
                    "string",
            )
            : [],
},
    };
}