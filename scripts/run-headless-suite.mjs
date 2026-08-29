import {
    existsSync,
} from "node:fs";

import {
    mkdir,
    readFile,
    writeFile,
} from "node:fs/promises";

import {
    join,
    resolve,
} from "node:path";

import {
    spawn,
} from "node:child_process";

import {
    flowOutputPaths,
    planSuiteBatches,
    summarizeRunResults,
} from "./lib/suite-batches.mjs";

import {
    runFlowsPool,
} from "./lib/suite-runner.mjs";

import {
    planSuiteTestFlows,
    readExecutionRecord,
    writeSuiteFlows,
} from "./lib/suite-flow.mjs";

function printUsage() {
    console.error(`
Usage:
  node scripts/run-headless-suite.mjs --flow <path> [--flow <path> ...] [--concurrency <n>] [--artifacts <dir>]
  node scripts/run-headless-suite.mjs --suite <suite.json> [--concurrency <n>] [--artifacts <dir>]

Examples:
  node scripts/run-headless-suite.mjs --flow ./androidTest.flow --flow ./iosTest.flow --concurrency 2
  node scripts/run-headless-suite.mjs --suite ./suite.json --concurrency 2
`);

}

function parseArguments() {
    const args =
        process.argv.slice(2);

    const flows = [];

    let suite = null;

    let concurrency = 1;

    let artifacts =
        "artifacts/execution";

    for (
        let index = 0;
        index < args.length;
        index += 1
    ) {
        const arg =
            args[index];

        if (
            arg === "--flow"
        ) {
            flows.push(
                args[index + 1],
            );

            index += 1;

            continue;
        }

        if (
            arg.startsWith(
                "--flow=",
            )
        ) {
            flows.push(
                arg.slice(
                    "--flow=".length,
                ),
            );

            continue;
        }

        if (
            arg === "--suite"
        ) {
            suite =
                args[index + 1];

            index += 1;

            continue;
        }

        if (
            arg.startsWith(
                "--suite=",
            )
        ) {
            suite =
                arg.slice(
                    "--suite=".length,
                );
        }

        if (
            arg === "--concurrency"
        ) {
            concurrency =
                Number.parseInt(
                    args[index + 1],
                    10,
                );

            index += 1;

            continue;
        }

        if (
            arg.startsWith(
                "--concurrency=",
            )
        ) {
            concurrency =
                Number.parseInt(
                    arg.slice(
                        "--concurrency=".length,
                    ),
                    10,
                );

            continue;
        }

        if (
            arg === "--artifacts"
        ) {
            artifacts =
                args[index + 1];

            index += 1;

            continue;
        }

        if (
            arg.startsWith(
                "--artifacts=",
            )
        ) {
            artifacts =
                arg.slice(
                    "--artifacts=".length,
                );
        }
    }

    return {
        flows,
        suite,
        concurrency,
        artifacts,
    };
}

async function loadSuite(
    suitePath,
) {
    const text =
        await readFile(
            suitePath,
            "utf8",
        );

    return JSON.parse(
        text,
    );
}

function buildRunnerCommand() {
    const vitestOverride =
        process.env
            .FLOWTEST_SUITE_VITEST;

    const vitestCommand =
        process.platform === "win32"
            ? "npx.cmd"
            : "npx";

    return vitestOverride
        ? vitestOverride.split(
              /\s+/,
          )
        : [
              vitestCommand,
              "vitest",
              "run",
              "tests/e2e/headless/headless.flow.test.ts",
          ];
}

const runnerCommand =
    buildRunnerCommand();

function spawnFlow({
    label,
    flowPath,
    artifactDir,
    reportPath,
}) {
    const reportArgs =
        process.env
            .FLOWTEST_SUITE_VITEST
            ? [
                  `--outputFile.junit=${reportPath}`,
              ]
            : [
                  "--reporter=dot",
                  "--reporter=junit",
                  `--outputFile.junit=${reportPath}`,
              ];

    const child =
        spawn(
            runnerCommand[0],
            [
                ...runnerCommand.slice(
                    1,
                ),
                ...reportArgs,
            ],
            {
                stdio: [
                    "ignore",
                    "pipe",
                    "pipe",
                ],

                env: {
                    ...process.env,

                    FLOWTEST_FLOW:
                        flowPath,

                    FLOWTEST_ARTIFACT_DIR:
                        artifactDir,
                },
            },
        );

    const prefix =
        `[${label}]`;

    child.stdout?.on(
        "data",
        (chunk) => {
            const text =
                String(
                    chunk,
                );

            for (
                const line
                    of text.split(
                        "\n",
                    )
            ) {
                if (
                    line.length > 0
                ) {
                    process.stdout.write(
                        `${prefix} ${line}\n`,
                    );
                }
            }
        },
    );

    child.stderr?.on(
        "data",
        (chunk) => {
            const text =
                String(
                    chunk,
                );

            for (
                const line
                    of text.split(
                        "\n",
                    )
            ) {
                if (
                    line.length > 0
                ) {
                    process.stderr.write(
                        `${prefix} ${line}\n`,
                    );
                }
            }
        },
    );

    return new Promise(
        (resolvePromise) => {
            child.on(
                "error",
                (error) => {
                    console.error(
                        `${prefix} Failed to start Vitest.`,
                        error,
                    );

                    resolvePromise({
                        label,
                        artifactDir,
                        reportPath,
                        exitCode: 1,
                    });
                },
            );

            child.on(
                "close",
                (
                    code,
                    signal,
                ) => {
                    const exitCode =
                        typeof code ===
                        "number"
                            ? code
                            : signal
                              ? 1
                              : 1;

                    resolvePromise({
                        label,
                        artifactDir,
                        reportPath,
                        exitCode,
                    });
                },
            );
        },
    );
}

const {
    flows: providedFlows,
    suite: suiteOption,
    concurrency,
    artifacts: artifactsOption,
} = parseArguments();

if (
    providedFlows.length === 0 &&
    !suiteOption
) {
    printUsage();

    process.exit(2);
}

const outputDirectory =
    resolve(
        artifactsOption,
    );

await mkdir(
    outputDirectory,
    {
        recursive: true,
    },
);

const suiteStartedAt =
    Date.now();

let flowEntries = [];

let suiteResult = null;

if (suiteOption) {
    const suitePath =
        resolve(
            suiteOption,
        );

    if (
        !existsSync(
            suitePath,
        )
    ) {
        console.error(
            `[Suite] Suite file not found: ${suitePath}`,
        );

        process.exit(2);
    }

    const suite =
        await loadSuite(
            suitePath,
        );

    const descriptors =
        planSuiteTestFlows(
            suite,
        );

    if (
        descriptors.length === 0
    ) {
        console.error(
            `[Suite] Suite has no enabled test cases.`,
        );

        process.exit(2);
    }

    const written =
        await writeSuiteFlows({
            outputDirectory,

            flows:
                descriptors,
        });

    flowEntries =
        written.map(
            (flow) => ({
                label:
                    flow.projectName,

                flowPath:
                    flow.flowPath,

                artifactDir:
                    flow.artifactDir,

                reportPath:
                    resolve(
                        join(
                            outputDirectory,
                            `${flow.id}.junit.xml`,
                        ),
                    ),

                testCaseId:
                    flow.testCaseId,

                projectId:
                    flow.projectId,

                projectName:
                    flow.projectName,
            }),
        );

    suiteResult = {
        suiteId:
            suite.id,

        suiteName:
            suite.name,
    };
} else {
    const flowPaths =
        providedFlows.map(
            (path) =>
                resolve(
                    path,
                ),
        );

    for (
        const flowPath
            of flowPaths
    ) {
        if (
            !existsSync(
                flowPath,
            )
        ) {
            console.error(
                `[Suite] Flow file not found: ${flowPath}`,
            );

            process.exit(2);
        }
    }

    flowEntries =
        flowPaths.map(
            (flowPath) => {
                const {
                    label,
                    artifactDir,
                    reportPath,
                } = flowOutputPaths({
                    outputDirectory,
                    flowPath,
                });

                return {
                    label,
                    flowPath,
                    artifactDir,
                    reportPath,
                };
            },
        );
}

const planned =
    planSuiteBatches({
        flowCount:
            flowEntries.length,
        concurrency,
    });

console.info(
    `[Suite] Flows: ${flowEntries.length}, concurrency: ${planned.batches[0]?.batchSize ?? 1} in ${planned.batches.length} batch(es)`,
);

const results =
    await runFlowsPool({
        flowCount:
            flowEntries.length,
        concurrency,
        runOne: (
            index,
        ) =>
            spawnFlow(
                flowEntries[
                    index
                ],
            ),
    });

const summary =
    summarizeRunResults(
        results,
    );

const summaryPath =
    resolve(
        outputDirectory,
        "summary.json",
    );

await writeFile(
    summaryPath,
    JSON.stringify(
        summary,
        null,
        4,
    ),
    "utf8",
);

if (suiteResult) {
    const suiteFinishedAt =
        Date.now();

    const records = [];

    for (
        const entry
            of flowEntries
    ) {
        const result =
            results.find(
                (item) =>
                    item.label ===
                    entry.label,
            );

        if (!result) {
            continue;
        }

        const record =
            await readExecutionRecord({
                artifactDir:
                    result.artifactDir,

                testCaseId:
                    entry.testCaseId,

                projectId:
                    entry.projectId,

                projectName:
                    entry.projectName,

                exitCode:
                    result.exitCode,

                startedAt:
                    suiteStartedAt,

                finishedAt:
                    suiteFinishedAt,
            });

        records.push(
            record,
        );
    }

    const suiteResultPath =
        resolve(
            outputDirectory,
            "suite-result.json",
        );

    await writeFile(
        suiteResultPath,
        JSON.stringify(
            {
                ...suiteResult,

                concurrency,

                startedAt:
                    suiteStartedAt,

                finishedAt:
                    suiteFinishedAt,

                records,
            },
            null,
            4,
        ),
        "utf8",
    );

    console.info(
        `[Suite] Suite result: ${suiteResultPath}`,
    );
}

console.info(
    `[Suite] ${summary.passed}/${summary.total} flows passed`,
);

console.info(
    `[Suite] Summary: ${summaryPath}`,
);

if (
    summary.failed > 0
) {
    process.exit(1);
}

process.exit(0);
