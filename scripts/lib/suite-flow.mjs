import {
    join,
    resolve,
} from "node:path";

import {
    mkdir,
    readFile,
    writeFile,
} from "node:fs/promises";

import {
    normalizeId,
} from "./suite-batches.mjs";

export function planSuiteTestFlows(
    suite,
) {
    return (suite.testCases ?? [])
        .filter(
            (testCase) =>
                testCase.enabled !==
                false,
        )
        .map(
            (testCase) => ({
                testCaseId:
                    testCase.id,

                projectId:
                    testCase.projectId,

                projectName:
                    testCase.projectName,

                project:
                    testCase.project,
            }),
        );
}

export async function writeSuiteFlows({
    outputDirectory,
    flows,
}) {
    const written = [];

    for (
        let index = 0;
        index < flows.length;
        index += 1
    ) {
        const flow = flows[index];

        const id =
            normalizeId(
                flow.testCaseId ||
                `testcase-${index}`,
            );

        const flowDir =
            join(
                outputDirectory,
                id,
            );

        await mkdir(
            flowDir,
            {
                recursive: true,
            },
        );

        const flowPath =
            join(
                flowDir,
                `${id}.flow`,
            );

        await writeFile(
            flowPath,
            JSON.stringify(
                flow.project,
                null,
                2,
            ),
            "utf8",
        );

        written.push({
            id,
            testCaseId:
                flow.testCaseId,

            projectName:
                flow.projectName,

            projectId:
                flow.projectId,

            flowPath:
                resolve(
                    flowPath,
                ),

            artifactDir:
                resolve(
                    flowDir,
                ),
        });
    }

    return written;
}

export async function readExecutionRecord({
    artifactDir,
    testCaseId,
    projectId,
    projectName,
    exitCode,
    startedAt,
    finishedAt,
}) {
    let execution = null;

    try {
        const text =
            await readFile(
                join(
                    artifactDir,
                    "execution.json",
                ),
                "utf8",
            );

        execution =
            JSON.parse(
                text,
            );
    } catch {
        execution = null;
    }

    const recordStartedAt =
        execution?.startedAt ??
        startedAt;

    const recordFinishedAt =
        execution?.finishedAt ??
        finishedAt ??
        startedAt;

    return {
        testCaseId,

        projectId,

        projectName,

        status:
            exitCode === 0
                ? "passed"
                : "failed",

        startedAt:
            recordStartedAt,

        finishedAt:
            recordFinishedAt,

        duration:
            execution?.duration ??
            (recordFinishedAt -
                recordStartedAt),

        ...(exitCode !== 0
            ? {
                  error:
                      execution?.failedNodes >
                      0
                          ? `Flow failed (${execution.failedNodes} node(s)).`
                          : `Flow did not pass (exit ${exitCode}).`,
              }
            : {}),

        artifactDir:
            resolve(
                artifactDir,
            ),
    };
}
