export interface PythonTestTemplateOptions {
    capabilities:
        Record<string, unknown>;

    serverUrl: string;
}

function serializePythonValue(
    value: unknown,
): string {
    if (value === null) {
        return "None";
    }

    if (typeof value === "string") {
        return JSON.stringify(value);
    }

    if (typeof value === "boolean") {
        return value
            ? "True"
            : "False";
    }

    if (typeof value === "number") {
        return String(value);
    }

    if (Array.isArray(value)) {
        return `[${value
            .map(serializePythonValue)
            .join(", ")}]`;
    }

    if (
        typeof value === "object" &&
        value !== null
    ) {
        const entries =
            Object.entries(
                value as Record<
                    string,
                    unknown
                >,
            );

        return `{${entries
            .map(
                ([key, item]) =>
                    `${JSON.stringify(
                        key,
                    )}: ${serializePythonValue(
                        item,
                    )}`,
            )
            .join(", ")}}`;
    }

    return JSON.stringify(
        String(value),
    );
}

function serializeCapabilities(
    capabilities: Record<
        string,
        unknown
    >,
): string {
    const entries =
        Object.entries(
            capabilities,
        );

    if (entries.length === 0) {
        return "{}";
    }

    return `{
${entries
            .map(
                ([key, value]) =>
                    `    ${JSON.stringify(
                        key,
                    )}: ${serializePythonValue(
                        value,
                    )}`,
            )
            .join(",\n")}
}`;
}

export function pythonTestTemplate(
    body: string,
    options: PythonTestTemplateOptions,
): string {
    const capabilities =
        serializeCapabilities(
            options.capabilities,
        );

    return `
from framework.driver import create_driver
from framework.actions import *
from framework.variables import *
from framework.assertions import *
from framework.waits import *

import framework.actions as actions
import framework.waits as waits


capabilities = ${capabilities}

driver = create_driver(
    capabilities,
    ${JSON.stringify(
        options.serverUrl,
    )},
)

actions.set_driver(driver)
waits.set_driver(driver)


def test_generated():
${body || "    pass"}

    driver.quit()
`.trim();
}