import {
    access,
    constants,
    mkdir,
} from "node:fs/promises";

import {
    dirname,
    resolve,
} from "node:path";

import {
    spawn,
} from "node:child_process";

function printUsage() {
    console.error(`
Usage:
  npm run test:headless -- --flow <path>

Example:
  npm run test:headless -- --flow /path/to/androidTest.flow
`);
}

function parseArguments() {
    const args =
        process.argv.slice(2);

    let flowPath =
        null;

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
            flowPath =
                args[index + 1];

            index += 1;

            continue;
        }

        if (
            arg.startsWith(
                "--flow=",
            )
        ) {
            flowPath =
                arg.slice(
                    "--flow=".length,
                );
        }
    }

    return {
        flowPath,
    };
}

const {
    flowPath: providedFlowPath,
} = parseArguments();

if (!providedFlowPath) {
    printUsage();

    process.exit(2);
}

const flowPath =
    resolve(
        providedFlowPath,
    );

try {
    await access(
        flowPath,
        constants.R_OK,
    );
} catch {
    console.error(
        `[Headless] Flow file not found or unreadable: ${flowPath}`,
    );

    process.exit(2);
}

const reportPath =
    resolve(
        "artifacts/test-results/junit.xml",
    );

await mkdir(
    dirname(reportPath),
    {
        recursive: true,
    },
);

console.info(
    `[Headless] Flow: ${flowPath}`,
);

console.info(
    `[Headless] JUnit report: ${reportPath}`,
);

const vitestCommand =
    process.platform === "win32"
        ? "npx.cmd"
        : "npx";

const child =
    spawn(
        vitestCommand,
        [
            "vitest",
            "run",
            "tests/e2e/headless/headless.flow.test.ts",
            "--reporter=default",
            "--reporter=junit",
            `--outputFile.junit=${reportPath}`,
        ],
        {
            stdio: "inherit",

            env: {
                ...process.env,

                FLOWTEST_FLOW:
                    flowPath,
            },
        },
    );

child.on(
    "error",
    (error) => {
        console.error(
            "[Headless] Failed to start Vitest.",
            error,
        );

        process.exit(1);
    },
);

child.on(
    "exit",
    (
        code,
        signal,
    ) => {
        if (signal) {
            console.error(
                `[Headless] Vitest terminated by signal: ${signal}`,
            );

            process.exit(1);
        }

        const exitCode =
            typeof code ===
            "number"
                ? code
                : 1;

        if (
            exitCode === 0
        ) {
            console.info(
                "[Headless] Execution completed successfully.",
            );

            console.info(
                `[Headless] JUnit report written to: ${reportPath}`,
            );
        } else {
            console.error(
                `[Headless] Execution failed with exit code ${exitCode}.`,
            );

            console.info(
                `[Headless] JUnit report written to: ${reportPath}`,
            );
        }

        process.exit(
            exitCode,
        );
    },
);