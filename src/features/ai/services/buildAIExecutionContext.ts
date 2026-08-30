import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import {
    buildFlowContext,
} from "./buildFlowContext";

import {
    redactSensitiveValue,
} from "../../security/redaction";

import type {
    AIExecutionContext,
} from "../types/AIExecutionContext";

export function buildAIExecutionContext(): AIExecutionContext {
    const flow =
        buildFlowContext();

    const execution =
        useExecutionStore.getState();

    const appium =
        useAppiumConfigStore.getState();

    const platform =
        appium.config.platformName;

    const device =
        platform === "Android"
            ? appium.config.android
            : appium.config.ios;

    const nodeResults =
        redactSensitiveValue(
            execution.nodeResults,
        ) as typeof execution.nodeResults;

    const nodeExecutionHistory =
        redactSensitiveValue(
            Object.fromEntries(
                Object.entries(
                    execution.nodeExecutionHistory ??
                    {},
                ).map(
                    (
                        [
                            nodeId,
                            history,
                        ],
                    ) => [
                            nodeId,
                            history.map(
                                (
                                    result,
                                ) => {
                                    const {
                                        screenshot,
                                        pageSource,
                                        ...aiResult
                                    } = result;

                                    void screenshot;
                                    void pageSource;

                                    return aiResult;
                                },
                            ),
                        ],
                ),
            ),
        ) as typeof execution.nodeExecutionHistory;

    const results =
        Object.values(
            nodeResults,
        );

    const totalNodes =
        flow.nodeCount;

    const executedNodes =
        results.length;

    const passedNodes =
        results.filter(
            (result) =>
                result.status ===
                "passed",
        ).length;

    const failedNodes =
        results.filter(
            (result) =>
                result.status ===
                "failed",
        ).length;

    const skippedNodes =
        Math.max(
            0,
            totalNodes -
            executedNodes,
        );

    const progress =
        totalNodes === 0
            ? 0
            : Math.round(
                (
                    executedNodes /
                    totalNodes
                ) * 100,
            );

    const startedAt =
        execution.startedAt ??
        null;

    const finishedAt =
        execution.finishedAt ??
        null;

    const duration =
        startedAt !== null
            ? (
                finishedAt ??
                Date.now()
            ) -
            startedAt
            : 0;

    return {
        flow,

        execution: {
            status:
                execution.status,

            currentNodeId:
                execution.currentNodeId,

            nodeStatus:
                execution.nodeStatus,

            edgeStatus:
                execution.edgeStatus,

            nodeResults,

            nodeExecutionHistory,

            statistics: {
                totalNodes,

                executedNodes,

                passedNodes,

                failedNodes,

                skippedNodes,

                progress,
            },

            timing: {
                startedAt,

                finishedAt,

                duration,
            },
        },

        environment: {
            appiumConnection:
                execution.appiumConnection,

            platform,

            deviceName:
                device.deviceName,

            platformVersion:
                device.platformVersion ||
                null,

            udid:
                device.udid ||
                null,
        },
    };
}