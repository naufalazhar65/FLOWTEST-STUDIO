import type {
    LocatorStrategy,
} from "../../execution/types/LocatorStrategy";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import type {
    AIFlowPlan,
} from "../types/AIFlowPlan";

import {
    validateAIFlowPlan,
} from "./validateAIFlowPlan";

import type {
    AIAllowedOperation,
} from "../types/AIAssistantSettings";

import {
    isOperationAllowed,
} from "./aiSettingsPolicy";

export interface AIFlowApplyResult {
    success: boolean;

    appliedSteps: number;

    nodeIds?: string[];

    error?: string;
}

const supportedLocatorStrategies:
    LocatorStrategy[] = [
        "accessibilityId",
        "id",
        "xpath",
        "className",
        "androidUiAutomator",
        "iOSPredicateString",
        "iOSClassChain",
    ];

function toLocatorStrategy(
    value:
        | string
        | null
        | undefined,
): LocatorStrategy {
    if (
        value &&
        supportedLocatorStrategies.includes(
            value as LocatorStrategy,
        )
    ) {
        return value as LocatorStrategy;
    }

    return "id";
}

function getLastNode() {
    const {
        nodes,
    } =
        useFlowStore.getState();

    return nodes.at(-1);
}

function getSemanticTarget(
    planStep: AIFlowPlan["steps"][number],
): string | undefined {
    if (
        typeof planStep.semanticTarget ===
        "string" &&
        planStep.semanticTarget.trim()
    ) {
        return planStep.semanticTarget.trim();
    }

    const title =
        planStep.title?.trim() ??
        "";

    if (!title) {
        return undefined;
    }

    const normalizedTitle =
        title
            .replace(
                /^(enter|input|type|tap|click|press|verify|check|assert|select|choose)\s+/i,
                "",
            )
            .replace(
                /\s+(button|field|element|input|textbox|text field|screen)$/i,
                "",
            )
            .trim();

    if (
        /^(username|user\s*name)$/i.test(
            normalizedTitle,
        )
    ) {
        return "username-field";
    }

    if (
        /^password$/i.test(
            normalizedTitle,
        )
    ) {
        return "password-field";
    }

    if (
        /^login$/i.test(
            normalizedTitle,
        )
    ) {
        return "login-button";
    }

    if (
        /^login\s+screen$/i.test(
            normalizedTitle,
        )
    ) {
        return "login-screen";
    }

    return (
        normalizedTitle ||
        undefined
    );
}

function applyActionOperation(
    action: AIFlowPlan["steps"][number]["action"],
): AIAllowedOperation {
    if (
        action ===
        "assert"
    ) {
        return "assertion";
    }

    return "interaction";
}

function applyStep(
    planStep: AIFlowPlan["steps"][number],
    allowedOperations:
        AIAllowedOperation[]
        | undefined,
): string {
    const operation =
        applyActionOperation(
            planStep.action,
        );

    if (
        allowedOperations &&
        !isOperationAllowed(
            operation,
            allowedOperations,
        )
    ) {
        throw new Error(
            `AI flow step "${planStep.action}" is blocked by the project's allowed-operation policy.`,
        );
    }

    const store =
        useFlowStore.getState();

    switch (
    planStep.action
    ) {
        case "launchApp": {
            store.addNode(
                "launchApp",
            );

            const node =
                getLastNode();

            if (!node) {
                throw new Error(
                    `Failed to create launchApp node for "${planStep.title}".`,
                );
            }

            console.error(
                "[AI APPLY STEP]",
                {
                    action:
                        planStep.action,

                    title:
                        planStep.title,

                    planSemanticTarget:
                        planStep.semanticTarget,

                    resolvedSemanticTarget:
                        getSemanticTarget(
                            planStep,
                        ),
                },
            );

            store.updateNodeData(
                node.id,
                {
                    title:
                        planStep.title,

                    subtitle:
                        planStep.description,

                    semanticTarget:
                        getSemanticTarget(
                            planStep,
                        ),
                },
            );

            return node.id;
        }

        case "tap": {
            if (
                !planStep.locator?.trim()
            ) {
                throw new Error(
                    `Tap step "${planStep.title}" is missing a locator.`,
                );
            }

            store.addNodeWithLocator(
                "tap",
                toLocatorStrategy(
                    planStep.locatorStrategy,
                ),
                planStep.locator,
            );

            const node =
                getLastNode();

            if (!node) {
                throw new Error(
                    `Failed to create tap node for "${planStep.title}".`,
                );
            }

            console.error(
                "[AI APPLY STEP]",
                {
                    action:
                        planStep.action,

                    title:
                        planStep.title,

                    locator:
                        planStep.locator,

                    planSemanticTarget:
                        planStep.semanticTarget,

                    resolvedSemanticTarget:
                        getSemanticTarget(
                            planStep,
                        ),
                },
            );

            store.updateNodeData(
                node.id,
                {
                    title:
                        planStep.title,

                    subtitle:
                        planStep.description,

                    text:
                        planStep.text ?? "",

                    semanticTarget:
                        getSemanticTarget(
                            planStep,
                        ),
                },
            );

            return node.id;
        }

        case "input": {
            if (
                !planStep.locator?.trim()
            ) {
                throw new Error(
                    `Input step "${planStep.title}" is missing a locator.`,
                );
            }

            const credentialField =
                planStep.semanticTarget ===
                "username-field" ||
                planStep.semanticTarget ===
                "password-field";

            if (
                !credentialField &&
                (
                    planStep.text ===
                    undefined ||
                    planStep.text ===
                    null
                )
            ) {
                throw new Error(
                    `Input step "${planStep.title}" is missing text.`,
                );
            }

            store.addNodeWithLocator(
                "input",
                toLocatorStrategy(
                    planStep.locatorStrategy,
                ),
                planStep.locator,
                planStep.text ?? "",
            );

            const node =
                getLastNode();

            if (!node) {
                throw new Error(
                    `Failed to create input node for "${planStep.title}".`,
                );
            }

            console.error(
                "[AI APPLY INPUT]",
                {
                    title:
                        planStep.title,

                    semanticTarget:
                        planStep.semanticTarget,

                    resolvedSemanticTarget:
                        getSemanticTarget(
                            planStep,
                        ),
                },
            );

            store.updateNodeData(
                node.id,
                {
                    title:
                        planStep.title,

                    subtitle:
                        planStep.description,

                    semanticTarget:
                        getSemanticTarget(
                            planStep,
                        ),
                },
            );

            return node.id;
        }

        case "assert": {
            if (
                !planStep.actual?.trim()
            ) {
                throw new Error(
                    `Assert step "${planStep.title}" is missing an actual value.`,
                );
            }

            if (
                !planStep.operator
            ) {
                throw new Error(
                    `Assert step "${planStep.title}" is missing an operator.`,
                );
            }

            if (
                !planStep.expected?.trim()
            ) {
                throw new Error(
                    `Assert step "${planStep.title}" is missing an expected value.`,
                );
            }

            store.addNode(
                "assert",
            );

            const node =
                getLastNode();

            if (!node) {
                throw new Error(
                    `Failed to create assert node for "${planStep.title}".`,
                );
            }

            store.updateNodeData(
                node.id,
                {
                    title:
                        planStep.title,

                    subtitle:
                        planStep.description,

                    actual:
                        planStep.actual,

                    operator:
                        planStep.operator,

                    expected:
                        planStep.expected,
                },
            );

            return node.id;
        }

        case "delay": {
            if (
                planStep.duration ===
                undefined ||
                planStep.duration ===
                null ||
                planStep.duration <= 0
            ) {
                throw new Error(
                    `Delay step "${planStep.title}" requires a positive duration.`,
                );
            }

            store.addNode(
                "delay",
            );

            const node =
                getLastNode();

            if (!node) {
                throw new Error(
                    `Failed to create delay node for "${planStep.title}".`,
                );
            }

            store.updateNodeData(
                node.id,
                {
                    title:
                        planStep.title,

                    subtitle:
                        planStep.description,

                    duration:
                        planStep.duration,
                },
            );

            return node.id;
        }

        case "wait": {
            if (
                !planStep.locator?.trim()
            ) {
                throw new Error(
                    `Wait step "${planStep.title}" is missing a locator.`,
                );
            }

            if (
                planStep.timeout ===
                undefined ||
                planStep.timeout ===
                null ||
                planStep.timeout <= 0
            ) {
                throw new Error(
                    `Wait step "${planStep.title}" requires a positive timeout.`,
                );
            }

            const pollingInterval =
                planStep.pollingInterval ??
                500;

            store.addNodeWithLocator(
                "wait",
                toLocatorStrategy(
                    planStep.locatorStrategy,
                ),
                planStep.locator,
            );

            const node =
                getLastNode();

            if (!node) {
                throw new Error(
                    `Failed to create wait node for "${planStep.title}".`,
                );
            }

            store.updateNodeData(
                node.id,
                {
                    title:
                        planStep.title,

                    subtitle:
                        planStep.description,

                    semanticTarget:
                        getSemanticTarget(
                            planStep,
                        ),

                    timeout:
                        planStep.timeout,

                    pollingInterval,
                },
            );

            return node.id;
        }

        case "back":
        case "home":
        case "closeApp":
        case "pressReturn":
        case "hideKeyboard":
        case "screenshot":
        case "setVariable":
        case "scroll":
        case "swipe":
        case "longPress":
        case "doubleTap":
        case "drag":
        case "pinch":
        case "zoom":
        case "fling":
        case "if":
        case "repeat":
        case "getText":
        case "getAttribute":
        case "elementExists":
        case "getDisplayed":
        case "getEnabled":
        case "getSelected":
        case "getCurrentActivity":
        case "getCurrentPackage":
        case "getOrientation":
        case "getPlatformVersion":
        case "getDeviceName":
        case "getDeviceTime":
        case "getLocation":
        case "getSize":
        case "getRect":
            throw new Error(
                `AI action "${planStep.action}" is not supported by the current AI applier yet.`,
            );

        default:
            throw new Error(
                `Unknown AI action "${planStep.action}".`,
            );
    }
}

export function applyAIFlowPlan(
    plan: AIFlowPlan,
    allowedOperations?:
        AIAllowedOperation[],
): AIFlowApplyResult {
    const validation =
        validateAIFlowPlan(
            plan,
        );

    if (
        !validation.valid
    ) {
        return {
            success: false,

            appliedSteps: 0,

            nodeIds: [],

            error:
                validation.errors.join(
                    " ",
                ),
        };
    }

    let appliedSteps =
        0;

    const nodeIds:
        string[] = [];

    try {
        for (
            const step of plan.steps
        ) {
            const nodeId =
                applyStep(
                    step,
                    allowedOperations,
                );

            nodeIds.push(
                nodeId,
            );

            appliedSteps +=
                1;
        }

        return {
            success: true,

            appliedSteps,

            nodeIds,
        };
    } catch (error) {
        return {
            success: false,

            appliedSteps,

            nodeIds,

            error:
                error instanceof Error
                    ? error.message
                    : "Failed to apply AI flow.",
        };
    }
}