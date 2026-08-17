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

function applyStep(
    planStep: AIFlowPlan["steps"][number],
): string {
    const store =
        useFlowStore.getState();

    switch (
    planStep.action
    ) {
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

            store.updateNodeData(
                node.id,
                {
                    title:
                        planStep.title,

                    subtitle:
                        planStep.description,

                    semanticTarget:
                        planStep.semanticTarget ??
                        planStep.locator ??
                        planStep.title,
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

            if (
                planStep.text ===
                undefined ||
                planStep.text ===
                null
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
                planStep.text,
            );

            const node =
                getLastNode();

            if (!node) {
                throw new Error(
                    `Failed to create input node for "${planStep.title}".`,
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
                        planStep.semanticTarget ??
                        planStep.locator ??
                        planStep.title,

                    text:
                        planStep.text,
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

        case "back":
        case "home":
        case "closeApp":
        case "pressReturn":
        case "hideKeyboard":
        case "screenshot":
        case "launchApp":
        case "setVariable":
        case "wait":
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