import type {
    AssertOperator,
    NodeAction,
} from "../../flow/types/flowNode";

import type {
    LocatorStrategy,
} from "../../execution/types/LocatorStrategy";

import type {
    AIFlowPlan,
    AIFlowStep,
} from "../types/AIFlowPlan";

export interface AIFlowValidationResult {
    valid: boolean;

    errors: string[];

    warnings: string[];
}

const locatorActions: NodeAction[] =
    [
        "tap",
        "input",
        "wait",
        "getText",
        "elementExists",
        "getAttribute",
        "getDisplayed",
        "getEnabled",
        "getSelected",
        "getLocation",
        "getSize",
        "getRect",
        "longPress",
        "doubleTap",
        "drag",
        "pinch",
        "zoom",
        "fling",
    ];

const validLocatorStrategies:
    LocatorStrategy[] = [
        "accessibilityId",
        "id",
        "xpath",
        "className",
        "androidUiAutomator",
        "iOSPredicateString",
        "iOSClassChain",
    ];

const validAssertOperators:
    AssertOperator[] = [
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
    ];

function requiresLocator(
    action: NodeAction,
): boolean {
    return locatorActions.includes(
        action,
    );
}

function isValidLocatorStrategy(
    value:
        | LocatorStrategy
        | null
        | undefined,
): boolean {
    if (!value) {
        return false;
    }

    return validLocatorStrategies.includes(
        value,
    );
}

function isValidAssertOperator(
    value:
        | AssertOperator
        | null
        | undefined,
): boolean {
    if (!value) {
        return false;
    }

    return validAssertOperators.includes(
        value,
    );
}

function validateStep(
    step: AIFlowStep,
    index: number,
): string[] {
    const errors: string[] = [];

    const position =
        index + 1;

    if (
        !step.id.trim()
    ) {
        errors.push(
            `Step ${position}: missing id.`,
        );
    }

    if (
        !step.title.trim()
    ) {
        errors.push(
            `Step ${position}: missing title.`,
        );
    }

    if (
        !step.description.trim()
    ) {
        errors.push(
            `Step ${position}: missing description.`,
        );
    }

    if (
        requiresLocator(
            step.action,
        )
    ) {
        if (
            !isValidLocatorStrategy(
                step.locatorStrategy,
            )
        ) {
            errors.push(
                `Step ${position}: ${step.action} requires a valid locator strategy.`,
            );
        }

        if (
            !step.locator?.trim()
        ) {
            errors.push(
                `Step ${position}: ${step.action} requires a locator.`,
            );
        }
    }

    if (
        step.action ===
        "input"
    ) {
        if (
            step.text ===
            undefined ||
            step.text ===
            null ||
            !step.text.trim()
        ) {
            errors.push(
                `Step ${position}: input requires text.`,
            );
        }
    }

    if (
        step.action ===
        "assert"
    ) {
        if (
            !step.actual?.trim()
        ) {
            errors.push(
                `Step ${position}: assert requires an actual value.`,
            );
        }

        if (
            !isValidAssertOperator(
                step.operator,
            )
        ) {
            errors.push(
                `Step ${position}: assert requires a valid operator.`,
            );
        }

        if (
            !step.expected?.trim()
        ) {
            errors.push(
                `Step ${position}: assert requires an expected value.`,
            );
        }
    }

    if (
        step.action ===
        "if"
    ) {
        if (
            !step.actual?.trim()
        ) {
            errors.push(
                `Step ${position}: if requires an actual value.`,
            );
        }

        if (
            !isValidAssertOperator(
                step.operator,
            )
        ) {
            errors.push(
                `Step ${position}: if requires a valid operator.`,
            );
        }

        if (
            !step.expected?.trim()
        ) {
            errors.push(
                `Step ${position}: if requires an expected value.`,
            );
        }
    }

    if (
        step.action ===
        "delay"
    ) {
        const duration =
            step.duration;

        if (
            duration ===
            undefined ||
            duration ===
            null ||
            duration <= 0
        ) {
            errors.push(
                `Step ${position}: delay requires a positive duration.`,
            );
        }
    }

    if (
        step.action ===
        "wait"
    ) {
        if (
            step.timeout ===
            undefined ||
            step.timeout ===
            null ||
            step.timeout <= 0
        ) {
            errors.push(
                `Step ${position}: wait requires a positive timeout.`,
            );
        }

        if (
            step.pollingInterval ===
            undefined ||
            step.pollingInterval ===
            null ||
            step.pollingInterval <= 0
        ) {
            errors.push(
                `Step ${position}: wait requires a positive polling interval.`,
            );
        }
    }

    if (
        [
            "getText",
            "elementExists",
            "getAttribute",
            "getDisplayed",
            "getEnabled",
            "getSelected",
            "getLocation",
            "getSize",
            "getRect",
        ].includes(
            step.action,
        )
    ) {
        if (
            !step.variableName?.trim()
        ) {
            errors.push(
                `Step ${position}: ${step.action} requires a variable name.`,
            );
        }
    }

    if (
        step.action ===
        "getAttribute"
    ) {
        if (
            !step.attribute?.trim()
        ) {
            errors.push(
                `Step ${position}: getAttribute requires an attribute.`,
            );
        }
    }

    if (
        step.action ===
        "setVariable"
    ) {
        if (
            !step.variableName?.trim()
        ) {
            errors.push(
                `Step ${position}: setVariable requires a variable name.`,
            );
        }

        if (
            step.text ===
            undefined ||
            step.text ===
            null
        ) {
            errors.push(
                `Step ${position}: setVariable requires a value.`,
            );
        }
    }

    if (
        step.action ===
        "repeat"
    ) {
        if (
            step.count ===
            undefined ||
            step.count ===
            null ||
            step.count <= 0
        ) {
            errors.push(
                `Step ${position}: repeat requires a positive count.`,
            );
        }
    }

    if (
        step.action ===
        "screenshot"
    ) {
        if (
            !step.fileName?.trim()
        ) {
            errors.push(
                `Step ${position}: screenshot requires a file name.`,
            );
        }
    }

    return errors;
}

export function validateAIFlowPlan(
    plan: AIFlowPlan,
): AIFlowValidationResult {
    const errors: string[] = [];

    if (
        plan.type !==
        "flow_plan"
    ) {
        errors.push(
            "Invalid flow plan type.",
        );
    }

    if (
        !plan.summary.trim()
    ) {
        errors.push(
            "Flow plan summary is empty.",
        );
    }

    if (
        !Array.isArray(
            plan.steps,
        ) ||
        plan.steps.length === 0
    ) {
        errors.push(
            "Flow plan must contain at least one step.",
        );
    }

    if (
        Array.isArray(
            plan.steps,
        )
    ) {
        plan.steps.forEach(
            (
                step,
                index,
            ) => {
                errors.push(
                    ...validateStep(
                        step,
                        index,
                    ),
                );
            },
        );
    }

    return {
        valid:
            errors.length === 0,

        errors,

        warnings:
            plan.warnings ??
            [],
    };
}