import type {
    FlowNode,
    LaunchAppNodeData,
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
    appiumSession,
} from "../services/appium/AppiumSession";

import {
    useAppiumConfigStore,
} from "../store/useAppiumConfigStore";

import {
    recoverApplicationState,
} from "../services/appium/recoverApplicationState";

import {
    applyModificationPlan,
} from "../../modification/services/applyModificationPlan";

import {
    analyzeExecutionFailure,
} from "./analyzeExecutionFailure";

import {
    buildSelfHealingPlan,
} from "./buildSelfHealingPlan";

import type {
    SelfHealingPlan,
} from "./buildSelfHealingPlan";

import {
    executeSelfHealing,
} from "./executeSelfHealing";

import {
    useHealingMetricsStore,
} from "../store/useHealingMetricsStore";

import {
    getActiveProjectId,
} from "../../project/storage/activeProject";

import type {
    AIAllowedOperation,
} from "../../ai/types/AIAssistantSettings";

import {
    isOperationAllowed,
} from "../../ai/services/aiSettingsPolicy";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    buildApplicationStateRecoveryPlan,
} from "./buildApplicationStateRecoveryPlan";

import {
    executeRecoveryPath,
} from "../engine/executeRecoveryPath";

import {
    executeNode,
} from "../engine/executeNode";

import {
    videoRecordingService,
} from "../services/appium/VideoRecordingService";

import {
    useVideoRecordingStore,
} from "../store/useVideoRecordingStore";

import type {
    EnvironmentName,
} from "../../environment/types/EnvironmentProfile";

import {
    loadEnvironmentByName,
} from "../../environment/services/loadEnvironmentByName";

import type {
    TestDataRow,
} from "../../testdata/types/TestDataSet";

import {
    loadTestDataRow,
} from "../../testdata/services/loadTestDataRow";

import {
    clearVariables,
} from "../variables/VariableStore";

import {
    useExecutionRetryStore,
} from "../store/useExecutionRetryStore";

export interface ExecutionControllerOptions {
    reuseExistingAppiumSession?:
    boolean;

    skipNodeIds?:
    ReadonlySet<string>;

    environmentName?:
    EnvironmentName;

    testDataRow?:
    TestDataRow;

    onManualHealingPlan?:
    (
        plan: NonNullable<
            SelfHealingPlan["modificationPlan"]
        >,
    ) => void;

    requireHealingApproval?:
    boolean;

    allowedOperations?:
    AIAllowedOperation[];
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

function healingFixIsAllowed(
    failureAnalysis:
        ReturnType<
            typeof analyzeExecutionFailure
        >,
    allowedOperations:
        AIAllowedOperation[]
        | undefined,
): boolean {
    if (
        !allowedOperations
    ) {
        return true;
    }

    const fixType =
        failureAnalysis?.suggestedFix?.type;

    if (
        fixType ===
        "repairLocator"
    ) {
        return isOperationAllowed(
            "locatorRepair",
            allowedOperations,
        );
    }

    if (
        fixType ===
        "addWait"
    ) {
        return isOperationAllowed(
            "addWait",
            allowedOperations,
        );
    }

    return true;
}

function buildVariableExecutionOptions(
    options?:
        ExecutionControllerOptions,
) {
    if (
        !options?.testDataRow
    ) {
        return undefined;
    }

    return {
        preserveVariables:
            true,
    };
}

function shouldPreserveDeviceConfig(): boolean {
    /*
     * A connected device (active Appium
     * session) always wins over the
     * environment's device profile.
     */
    if (
        appiumSession.hasSession()
    ) {
        return true;
    }

    /*
     * A device that was already selected in
     * the Device Manager wins as well so the
     * run does not silently swap to a stale
     * profile-specified UDID.
     */
    const config =
        useAppiumConfigStore
            .getState()
            .config;

    const platformKey =
        config.platformName ===
        "Android"
            ? "android"
            : "ios";

    const device =
        config[platformKey];

    return Boolean(
        device.udid ||
            device.deviceName,
    );
}

function buildRetryExecutionContext(
    context: ExecutionContext,
    edges?: ExecutionContext["edges"],
): ExecutionContext {
    const retry =
        useExecutionRetryStore.getState();

    return {
        ...context,

        ...(edges
            ? {
                edges,
            }
            : {}),

        retry: {
            enabled:
                retry.enabled,

            maxAttempts:
                retry.maxAttempts,

            retryDelayMs:
                retry.retryDelayMs,
        },
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

            const variableExecutionOptions =
                buildVariableExecutionOptions(
                    options,
                );

            clearVariables();

            if (
                options?.environmentName
            ) {
                loadEnvironmentByName(
                    options.environmentName,
                    {
                        preserveDeviceConfig:
                            shouldPreserveDeviceConfig(),
                    },
                );
            }

            if (
                options?.testDataRow
            ) {
                loadTestDataRow(
                    options.testDataRow,
                    {
                        replaceExisting:
                            false,
                    },
                );
            }

            const executionOptions = {
                ...(executeOptions ?? {}),
                ...(variableExecutionOptions ??
                    {}),
            };

            const executionContext =
                buildRetryExecutionContext(
                    context,
                );

            if (
                Object.keys(
                    executionOptions,
                ).length > 0
            ) {
                await executeFlow(
                    nodes,
                    executionContext,
                    executionOptions,
                );
            } else {
                await executeFlow(
                    nodes,
                    executionContext,
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

            const failureAnalysis =
                analyzeExecutionFailure(
                    executionResults,
                    nodes,
                    context.edges,
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
             * Every self-healing configuration change is
             * the result of a "modification" strategy
             * (e.g. a locator repair that rewrites node
             * data). When explicit approval is required,
             * these must not be applied automatically;
             * surface the plan for the user to review and
             * approve via onManualHealingPlan instead.
             *
             * Runtime recovery is not a configuration
             * change (it restores application state), so
             * it continues to auto-run.
             */
            const requiresApproval =
                options?.requireHealingApproval ===
                    true &&
                selfHealingPlan.strategy ===
                    "modification";

            const healingOperationAllowed =
                healingFixIsAllowed(
                    failureAnalysis,
                    options?.allowedOperations,
                );

            /*
             * No automatic repair is currently
             * available, the repair needs explicit
             * user approval, or the repair exceeds
             * the project's allowed-operation
             * policies. Preserve existing behavior
             * and propagate the original error.
             */
            if (
                !selfHealingPlan.canAutoApply ||
                requiresApproval ||
                !healingOperationAllowed
            ) {
                if (
                    requiresApproval &&
                    selfHealingPlan.modificationPlan
                ) {
                    const metricsProjectId =
                        getActiveProjectId();

                    if (
                        metricsProjectId
                    ) {
                        useHealingMetricsStore
                            .getState()
                            .recordRejectedHealing(
                                metricsProjectId,

                                selfHealingPlan.strategy,
                            );
                    }

                    options?.onManualHealingPlan?.(
                        selfHealingPlan.modificationPlan,
                    );
                }

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

            const healingResult =
                await executeSelfHealing(
                    selfHealingPlan,
                    {
                        executeRecovery:
                            async () => {
                                if (
                                    selfHealingPlan.strategy !==
                                    "runtimeRecovery"
                                ) {
                                    return {
                                        success:
                                            false,

                                        error:
                                            "Runtime recovery was requested for a non-runtime self-healing strategy.",
                                    };
                                }

                                const failedNodeId =
                                    failureAnalysis
                                        .context
                                        ?.node.id;

                                if (
                                    !failedNodeId
                                ) {
                                    return {
                                        success:
                                            false,

                                        error:
                                            "Failed node context is unavailable for application state recovery.",
                                    };
                                }

                                const latestFlow =
                                    useFlowStore.getState();

                                const launchNode =
                                    latestFlow.nodes.find(
                                        (
                                            node,
                                        ): node is FlowNode & {
                                            data:
                                            LaunchAppNodeData;
                                        } =>
                                            node.data.action ===
                                            "launchApp",
                                    );

                                if (
                                    !launchNode
                                ) {
                                    return {
                                        success:
                                            false,

                                        error:
                                            "No Launch App node was available for application state recovery.",
                                    };
                                }

                                const recoveryPath =
                                    buildApplicationStateRecoveryPlan(
                                        latestFlow.nodes,
                                        latestFlow.edges,
                                        failedNodeId,
                                    );

                                if (
                                    recoveryPath.length === 0
                                ) {
                                    return {
                                        success:
                                            false,

                                        error:
                                            "No deterministic application state recovery path was available.",
                                    };
                                }


                                try {
                                    await recoverApplicationState(
                                        launchNode.data,
                                    );

                                    const recoveryPathWithoutLaunch =
                                        recoveryPath.filter(
                                            (node) =>
                                                node.data.action !==
                                                "launchApp",
                                        );

                                    await executeRecoveryPath(
                                        recoveryPathWithoutLaunch,
                                        {
                                            ...context,
                                            edges:
                                                latestFlow.edges,
                                        },
                                    );

                                    return {
                                        success:
                                            true,

                                        appliedSteps:
                                            recoveryPath.length,
                                    };
                                } catch (
                                error
                                ) {
                                    return {
                                        success:
                                            false,

                                        appliedSteps:
                                            0,

                                        error:
                                            error instanceof Error
                                                ? error.message
                                                : String(
                                                    error,
                                                ),
                                    };
                                }
                            },

                        applyModificationPlan:
                            (
                                modificationPlan,
                            ) =>
                                applyModificationPlan(
                                    modificationPlan,
                                ),

                        rerun:
                            async () => {
                                useExecutionStore
                                    .getState()
                                    .markNextExecutionAsRerun();
                                /*
                                 * Runtime recovery has already created
                                 * a fresh Appium session.
                                 *
                                 * Do not delete that session before
                                 * retrying the failed node.
                                 */
                                if (
                                    selfHealingPlan.strategy !==
                                    "runtimeRecovery" &&
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

                                const retryExecutionContext =
                                    buildRetryExecutionContext(
                                        context,
                                        latestEdges,
                                    );

                                if (
                                    selfHealingPlan.strategy ===
                                    "runtimeRecovery"
                                ) {
                                    const failedNodeId =
                                        failureAnalysis
                                            .context
                                            ?.node.id;

                                    if (
                                        !failedNodeId
                                    ) {
                                        console.error(
                                            "[SELF-HEALING] Failed node is unavailable for runtime recovery rerun.",
                                        );

                                        return false;
                                    }

                                    const failedNode =
                                        latestNodes.find(
                                            (
                                                node,
                                            ) =>
                                                node.id ===
                                                failedNodeId,
                                        );

                                    if (
                                        !failedNode
                                    ) {
                                        console.error(
                                            "[SELF-HEALING] Failed node could not be found in the latest flow.",
                                            {
                                                failedNodeId,
                                            },
                                        );

                                        return false;
                                    }

                                    try {
                                        await executeNode(
                                            failedNode,
                                            buildRetryExecutionContext(
                                                context,
                                                latestEdges,
                                            ),
                                        );

                                        useExecutionStore
                                            .getState()
                                            .finalizeRecoveredExecution();

                                        return true;
                                    } catch {
                                        return false;
                                    }
                                }

                                try {
                                    const executeOptions =
                                        buildExecuteFlowOptions(
                                            options,
                                        );

                                    if (
                                        executeOptions
                                    ) {
                                        await executeFlow(
                                            latestNodes,
                                            retryExecutionContext,
                                            {
                                                ...(executeOptions ?? {}),
                                                ...(options?.testDataRow
                                                    ? {
                                                        preserveVariables:
                                                            true,
                                                    }
                                                    : {}),

                                                preserveExecutionHistory:
                                                    true,
                                            },
                                        );
                                    } else {
                                        await executeFlow(
                                            latestNodes,
                                            retryExecutionContext,
                                            {
                                                ...(options?.testDataRow
                                                    ? {
                                                        preserveVariables:
                                                            true,
                                                    }
                                                    : {}),

                                                preserveExecutionHistory:
                                                    true,
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

            const healingMetricsProjectId =
                getActiveProjectId();

            if (
                healingMetricsProjectId
            ) {
                useHealingMetricsStore
                    .getState()
                    .recordHealingResult({
                        projectId:
                            healingMetricsProjectId,

                        result:
                            healingResult,

                        strategy:
                            selfHealingPlan.strategy,
                    });
            }

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
 * ------------------------------------------
 * Second healing phase
 * ------------------------------------------
 *
 * Runtime recovery may restore the application
 * state successfully, but the failed node can
 * still fail afterward because its locator is
 * stale.
 *
 * Re-analyze the latest execution result before
 * attempting a second healing strategy.
 *
 * Maximum healing phases:
 *
 * 1. Runtime recovery + rerun
 * 2. Locator repair + rerun
 *
 * Never attempt a third automatic healing phase.
 */
            if (
                selfHealingPlan.strategy ===
                "runtimeRecovery" &&
                healingResult.status ===
                "failed"
            ) {
                const latestExecutionState =
                    useExecutionStore.getState();

                const latestExecutionResults =
                    Object.values(
                        latestExecutionState.nodeResults,
                    );

                const latestFailureAnalysis =
                    analyzeExecutionFailure(
                        latestExecutionResults,
                        useFlowStore.getState().nodes,
                        useFlowStore.getState().edges,
                    );

                if (
                    latestFailureAnalysis
                ) {
                    const secondHealingPlan =
                        await buildSelfHealingPlan(
                            latestFailureAnalysis,
                        );

                    /*
                     * Only locator repair is allowed as
                     * the second automatic healing phase.
                     *
                     * This prevents recovery → recovery →
                     * recovery loops.
                     */
                    if (
                        secondHealingPlan.strategy ===
                        "modification" &&
                        secondHealingPlan.canAutoApply &&
                        secondHealingPlan.modificationPlan &&
                        options?.requireHealingApproval !==
                            true &&
                        isOperationAllowed(
                            "locatorRepair",
                            options?.allowedOperations,
                        )
                    ) {
                        const secondHealingResult =
                            await executeSelfHealing(
                                secondHealingPlan,
                                {
                                    applyModificationPlan:
                                        (
                                            modificationPlan,
                                        ) =>
                                            applyModificationPlan(
                                                modificationPlan,
                                            ),

                                    rerun:
                                        async () => {
                                            const latestFlow =
                                                useFlowStore.getState();

                                            const failedNodeId =
                                                latestFailureAnalysis
                                                    .context
                                                    ?.node.id;

                                            if (
                                                !failedNodeId
                                            ) {
                                                return false;
                                            }

                                            const failedNode =
                                                latestFlow.nodes.find(
                                                    (
                                                        node,
                                                    ) =>
                                                        node.id ===
                                                        failedNodeId,
                                                );

                                            if (
                                                !failedNode
                                            ) {
                                                return false;
                                            }

                                            try {
                                                await executeNode(
                                                    failedNode,
                                                    buildRetryExecutionContext(
                                                        context,
                                                        latestFlow.edges,
                                                    ),
                                                );

                                                return true;
                                            } catch {
                                                return false;
                                            }
                                        },
                                },
                            );

                        const secondMetricsProjectId =
                            getActiveProjectId();

                        if (
                            secondMetricsProjectId
                        ) {
                            useHealingMetricsStore
                                .getState()
                                .recordHealingResult({
                                    projectId:
                                        secondMetricsProjectId,

                                    result:
                                        secondHealingResult,

                                    strategy:
                                        secondHealingPlan.strategy,
                                });
                        }

                        if (
                            secondHealingResult.status ===
                            "applied"
                        ) {
                            return;
                        }
                    }
                }
            }

            /*
             * A verified fix exists, but it requires
             * explicit user approval.
             *
             * Do not modify the flow and do not rerun.
             */
            if (
                healingResult.status ===
                "manualReview" &&
                selfHealingPlan.modificationPlan
            ) {
                const reviewMetricsProjectId =
                    getActiveProjectId();

                if (
                    reviewMetricsProjectId
                ) {
                    useHealingMetricsStore
                        .getState()
                        .recordRejectedHealing(
                            reviewMetricsProjectId,

                            selfHealingPlan.strategy,
                        );
                }

                options?.onManualHealingPlan?.(
                    selfHealingPlan.modificationPlan,
                );

                throw originalError;
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
                {
                    cause: originalError,
                },
            );
        } finally {
            if (
                videoRecordingService
                    .isRecording()
            ) {
                try {
                    const artifact =
                        await videoRecordingService
                            .stop();

                    if (artifact) {
                        const byteCharacters =
                            atob(
                                artifact.base64,
                            );

                        const byteNumbers =
                            new Array(
                                byteCharacters.length,
                            );

                        for (
                            let index = 0;
                            index <
                            byteCharacters.length;
                            index += 1
                        ) {
                            byteNumbers[index] =
                                byteCharacters.charCodeAt(
                                    index,
                                );
                        }

                        const byteArray =
                            new Uint8Array(
                                byteNumbers,
                            );

                        const blob =
                            new Blob(
                                [byteArray],
                                {
                                    type:
                                        artifact.mimeType,
                                },
                            );

                        const url =
                            URL.createObjectURL(
                                blob,
                            );

                        const link =
                            document.createElement(
                                "a",
                            );

                        link.href =
                            url;

                        link.download =
                            artifact.fileName;

                        link.click();

                        URL.revokeObjectURL(
                            url,
                        );
                    }
                } catch (error) {
                    console.warn(
                        "[Video Recording] Failed to stop or save recording.",
                        error,
                    );
                }
            }

            useVideoRecordingStore
                .getState()
                .reset();
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