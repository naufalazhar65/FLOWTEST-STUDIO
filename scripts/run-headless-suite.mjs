import {
    existsSync,
} from "node:fs";

import {
    mkdir,
    writeFile,
} from "node:fs/promises";

import {
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

function printUsage() {
    console.error(`
Usage:
  node scripts/run-headless-suite.mjs --flow <path> [--flow <path> ...] [--concurrency <n>] [--artifacts <dir>]

Examples:
  node scripts/run-headless-suite.mjs --flow ./androidTest.flow --flow ./iosTest.flow --concurrency 2
  node scripts/run-headless-suite.mjs --flow ./a.flow --flow ./b.flow --concurrency 1
`);
}

function parseArguments() {
    const args =
        process.argv.slice(2);

    const flows = [];

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
        concurrency,
        artifacts,
    };
}

const {
    flows: providedFlows,
    concurrency,
    artifacts: artifactsOption,
} = parseArguments();

if (
    providedFlows.length === 0
) {
    printUsage();

    process.exit(2);
}

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

const planned =
    planSuiteBatches({
        flowCount:
            flowPaths.length,
        concurrency,
    });

console.info(
    `[Suite] Flows: ${flowPaths.length}, concurrency: ${planned.batches[0]?.batchSize ?? 1} in ${planned.batches.length} batch(es)`,
);

const vitestOverride =
    process.env
        .FLOWTEST_SUITE_VITEST;

const vitestCommand =
    process.platform === "win32"
        ? "npx.cmd"
        : "npx";

const runnerCommand =
    vitestOverride
        ? vitestOverride.split(
              /\s+/,
          )
        : [
              vitestCommand,
              "vitest",
              "run",
              "tests/e2e/headless/headless.flow.test.ts",
          ];

function spawnFlow(
    flowPath,
) {
    const {
        label,
        artifactDir,
        reportPath,
    } = flowOutputPaths({
        outputDirectory,
        flowPath,
    });

    const reportArgs =
        vitestOverride
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
                        reportPath,
                        exitCode,
                    });
                },
            );
        },
    );
}

const results =
    await runFlowsPool({
        flowCount:
            flowPaths.length,
        concurrency,
        runOne: (
            index,
        ) =>
            spawnFlow(
                flowPaths[
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
