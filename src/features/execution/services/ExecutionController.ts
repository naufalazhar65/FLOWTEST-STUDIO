import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    ExecutionContext,
} from "../types/ExecutionContext";

import {
    executeFlow,
} from "../engine/executeFlow";

import {
    useExecutionStore,
} from "../store/useExecutionStore";

import {
    appiumClient,
} from "../services/appium/AppiumClient";

import {
    applyAIModificationPlan,
} from "../../ai/services/applyAIModificationPlan";

import {
    analyzeExecutionFailure,
} from "./analyzeExecutionFailure";

import {
    buildSelfHealingPlan,
} from "./buildSelfHealingPlan";

import {
    executeSelfHealing,
} from "./executeSelfHealing";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

interface ExecutionControllerOptions {
    reuseExistingAppiumSession?:
    boolean;

    skipNodeIds?:
    ReadonlySet<string>;
}

function buildExecuteFlowOptions(
    options?:
        ExecutionControllerOptions,
) {
    if (
        !options?.skipNodeIds
    ) {
        return undefined;
    }

    return {
        skipNodeIds:
            options.skipNodeIds,
    };
}

export class ExecutionController {
    static async run(
        nodes: FlowNode[],
        context: ExecutionContext,
        options?: ExecutionControllerOptions,
    ): Promise<void> {
        const status =
            useExecutionStore
                .getState()
                .status;

        /*
         * Do not start another execution while
         * the current execution is active.
         */
        if (
            status === "running" ||
            status === "paused"
        ) {
            return;
        }

        /*
         * Normal execution starts from a
         * fresh Appium session.
         *
         * AI execution can explicitly reuse
         * an already established session,
         * for example after Launch App has
         * already created the session.
         */
        if (
            !options?.reuseExistingAppiumSession
        ) {
            await appiumClient.deleteSession();
        }

        try {
            const executeOptions =
                buildExecuteFlowOptions(
                    options,
                );

            if (executeOptions) {
                await executeFlow(
                    nodes,
                    context,
                    executeOptions,
                );
            } else {
                await executeFlow(
                    nodes,
                    context,
                );
            }

            return;
        } catch (
        originalError
        ) {
            /*
             * ------------------------------------------
             * Failure analysis
             * ------------------------------------------
             */
            const executionState =
                useExecutionStore.getState();

            const executionResults =
                Object.values(
                    executionState.nodeResults,
                );

            console.log(
                "[SELF-HEALING] Execution failed. Starting failure analysis.",
                {
                    error:
                        originalError instanceof Error
                            ? originalError.message
                            : String(originalError),

                    executionResults,
                },
            );

            const failureAnalysis =
                analyzeExecutionFailure(
                    executionResults,
                    nodes,
                    context.edges,
                );

            console.log(
                "[SELF-HEALING] Failure analysis result:",
                failureAnalysis,
            );

            /*
             * If there is not enough evidence to
             * analyze the failure, preserve the
             * original execution error.
             */
            if (
                !failureAnalysis
            ) {
                throw originalError;
            }

            /*
             * ------------------------------------------
             * Build deterministic self-healing plan
             * ------------------------------------------
             */
            const selfHealingPlan =
                await buildSelfHealingPlan(
                    failureAnalysis,
                );

            /*
             * No automatic repair is currently
             * available. Preserve existing behavior
             * and propagate the original error.
             */
            if (
                !selfHealingPlan.canAutoApply ||
                !selfHealingPlan.modificationPlan
            ) {
                console.log(
                    "[SELF-HEALING] No automatic repair available.",
                    {
                        canAutoApply:
                            selfHealingPlan.canAutoApply,

                        modificationPlan:
                            selfHealingPlan.modificationPlan,

                        reason:
                            selfHealingPlan.reason,
                    },
                );

                throw originalError;
            }

            /*
             * ------------------------------------------
             * Apply repair and rerun once
             * ------------------------------------------
             *
             * executeSelfHealing() owns the one-attempt
             * safety guard.
             */
            console.log(
                "[SELF-HEALING] Applying repair and rerunning flow...",
                {
                    modificationPlan:
                        selfHealingPlan.modificationPlan,
                },
            );

            const healingResult =
                await executeSelfHealing(

                    selfHealingPlan,
                    {
                        applyModificationPlan:
                            (
                                modificationPlan,
                            ) =>
                                applyAIModificationPlan(
                                    modificationPlan,
                                ),

                        rerun:
                            async () => {
                                /*
                                 * If the caller already owns
                                 * an active Appium session,
                                 * preserve that session.
                                 *
                                 * This is important for AI
                                 * execution because the
                                 * Launch App node is skipped
                                 * during execution.
                                 */
                                if (
                                    !options?.reuseExistingAppiumSession
                                ) {
                                    await appiumClient.deleteSession();
                                }

                                const latestFlow =
                                    useFlowStore.getState();

                                const latestNodes =
                                    latestFlow.nodes;

                                const latestEdges =
                                    latestFlow.edges;

                                try {
                                    const executeOptions =
                                        buildExecuteFlowOptions(
                                            options,
                                        );

                                    if (executeOptions) {
                                        await executeFlow(
                                            latestNodes,
                                            {
                                                ...context,

                                                edges:
                                                    latestEdges,
                                            },
                                            executeOptions,
                                        );
                                    } else {
                                        await executeFlow(
                                            latestNodes,
                                            {
                                                ...context,

                                                edges:
                                                    latestEdges,
                                            },
                                        );
                                    }

                                    return true;
                                } catch {
                                    return false;
                                }
                            },
                    },
                );

            console.log(
                "[SELF-HEALING] Healing result:",
                healingResult,
            );
            console.log(
                "[SELF-HEALING] Rerun status:",
                healingResult.status,
            );
            /*
             * The repair and rerun succeeded.
             */
            if (
                healingResult.status ===
                "applied"
            ) {
                return;
            }

            /*
             * Healing itself failed or the rerun
             * still failed. Surface a useful error
             * while preserving the original failure
             * as the primary cause.
             */
            const healingError =
                healingResult.error ??
                "Self-healing failed.";

            const originalMessage =
                originalError instanceof Error
                    ? originalError.message
                    : String(
                        originalError,
                    );

            throw new Error(
                `Execution failed: ${originalMessage}. Self-healing failed: ${healingError}`,
            );
        }
    }

    static pause() {
        useExecutionStore
            .getState()
            .pauseExecution();
    }

    static resume() {
        useExecutionStore
            .getState()
            .resumeExecution();
    }

    static stop() {
        useExecutionStore
            .getState()
            .stopExecution();
    }
}