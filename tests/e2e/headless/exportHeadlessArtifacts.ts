import {
    mkdir,
    writeFile,
} from "node:fs/promises";

import {
    join,
} from "node:path";

import {
    useExecutionLogStore,
} from "../../../src/features/execution/store/useExecutionLogStore";

import {
    useExecutionStore,
} from "../../../src/features/execution/store/useExecutionStore";

import {
    classifyNodeOutcome,
    summarizeFlakiness,
} from "../../../src/features/execution/services/classifyNodeOutcome";

import type {
    ExecutionLog,
} from "../../../src/features/execution/store/useExecutionLogStore";

interface HeadlessArtifactOptions {
    outputDirectory: string;
}

function sanitizeFileName(
    value: string,
): string {
    return value
        .replace(
            /[^a-zA-Z0-9._-]/g,
            "-",
        )
        .replace(
            /-+/g,
            "-",
        )
        .replace(
            /^-|-$/g,
            "",
        )
        .toLowerCase();
}

function decodeBase64(
    value: string,
): Buffer {
    const normalized =
        value.includes(",")
            ? value.split(",", 2)[1] ?? ""
            : value;

    return Buffer.from(
        normalized,
        "base64",
    );
}

import {
    redactSensitiveValue,
} from "../../../src/features/security/redaction";

function sanitizeLog(
    log: ExecutionLog,
): Record<
    string,
    unknown
> {
    return redactSensitiveValue(
        Object.fromEntries(
            Object.entries(
                log,
            ),
        ),
    ) as Record<
        string,
        unknown
    >;
}

export async function exportHeadlessArtifacts({
    outputDirectory,
}: HeadlessArtifactOptions): Promise<void> {
    const execution =
        useExecutionStore.getState();

    const logs =
        useExecutionLogStore
            .getState()
            .logs;

    const screenshotsDirectory =
        join(
            outputDirectory,
            "screenshots",
        );

    const pageSourceDirectory =
        join(
            outputDirectory,
            "page-source",
        );

    await mkdir(
        screenshotsDirectory,
        {
            recursive: true,
        },
    );

    await mkdir(
        pageSourceDirectory,
        {
            recursive: true,
        },
    );

    const nodeResults =
        Object.values(
            execution.nodeResults,
        ).sort(
            (a, b) =>
                a.startedAt -
                b.startedAt,
        );

    const flakiness =
        summarizeFlakiness(
            nodeResults,
        );

    const executionReport = {
        status:
            execution.status,

        environment:
            execution.environment,

        totalNodes:
            execution.totalNodes,

        executedNodes:
            execution.executedNodes,

        passedNodes:
            execution.passedNodes,

        failedNodes:
            execution.failedNodes,

        flakyNodes:
            flakiness.flaky,

        flakyRate:
            flakiness.flakyRate,

        progress:
            execution.progress,

        startedAt:
            execution.startedAt,

        finishedAt:
            execution.finishedAt,

        duration:
            execution.duration,

        nodes:
            nodeResults.map(
                (node) => ({
                    nodeId:
                        node.nodeId,

                    nodeType:
                        node.nodeType,

                    nodeTitle:
                        node.nodeTitle,

                    status:
                        node.status,

                    outcome:
                        classifyNodeOutcome(
                            node,
                        ),

                    startedAt:
                        node.startedAt,

                    finishedAt:
                        node.finishedAt,

                    duration:
                        node.duration,

                    attempts:
                        node.attempts,

                    retries:
                        node.retries,

                    retryReason:
                        node.retryReason,

                    error:
                        node.error,

                    screenshotFileName:
                        node.screenshotFileName,

                    pageSourceAvailable:
                        Boolean(
                            node.pageSource,
                        ),
                }),
            ),
    };

    const sanitizedLogs =
        logs.map(
            (log) =>
                sanitizeLog(
                    log,
                ),
        );

    await writeFile(
        join(
            outputDirectory,
            "execution.json",
        ),
        JSON.stringify(
            executionReport,
            null,
            2,
        ),
        "utf-8",
    );

    await writeFile(
        join(
            outputDirectory,
            "logs.json",
        ),
        JSON.stringify(
            sanitizedLogs,
            null,
            2,
        ),
        "utf-8",
    );

    for (
        const node of nodeResults
    ) {
        if (
            node.screenshot
        ) {
            const fileName =
                node.screenshotFileName ??
                `screenshot-${node.nodeId}.png`;

            const safeName =
                sanitizeFileName(
                    fileName,
                );

            await writeFile(
                join(
                    screenshotsDirectory,
                    safeName ||
                    `screenshot-${node.nodeId}.png`,
                ),
                decodeBase64(
                    node.screenshot,
                ),
            );
        }

        if (
            node.pageSource
        ) {
            const safeNodeId =
                sanitizeFileName(
                    node.nodeId,
                );

            await writeFile(
                join(
                    pageSourceDirectory,
                    `${safeNodeId}.xml`,
                ),
                node.pageSource,
                "utf-8",
            );
        }
    }
}