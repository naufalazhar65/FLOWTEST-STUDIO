import {
    execFile,
} from "node:child_process";

import {
    promisify,
} from "node:util";

const execFileAsync =
    promisify(execFile);

const ADB_COMMAND =
    "adb";

const ADB_DEVICE_STATES =
    new Set([
        "device",
        "offline",
        "unauthorized",
        "no permissions",
        "bootloader",
        "authorizing",
        "recovery",
        "sideload",
    ]);

function normalizeDevice(
    device,
    properties,
) {
    const serial =
        device?.serial;

    const model =
        properties?.model;

    const version =
        properties?.version;

    if (
        typeof serial !==
            "string" ||
        !serial ||
        typeof model !==
            "string" ||
        !model ||
        typeof version !==
            "string" ||
        !version
    ) {
        return null;
    }

    const emulator =
        serial.startsWith(
            "emulator-",
        );

    return {
        id:
            serial,

        name:
            model,

        platform:
            "android",

        version,

        udid:
            serial,

        status:
            device.state ===
                "device"
                ? "connected"
                : "offline",

        emulator,
    };
}

export function parseAdbDevices(
    output,
) {
    if (
        typeof output !==
            "string"
    ) {
        return [];
    }

    return output
        .split(/\r?\n/)
        .map(
            (
                line,
            ) =>
                line.trim(),
        )
        .filter(
            (
                line,
            ) =>
                Boolean(line),
        )
        .map(
            (
                line,
            ) => {
                const parts =
                    line.split(
                        /\s+/,
                    );

                const serial =
                    parts[0];

                const state =
                    parts[1];

                if (
                    !serial ||
                    !state
                ) {
                    return null;
                }

                if (
                    !ADB_DEVICE_STATES.has(
                        state,
                    )
                ) {
                    return null;
                }

                return {
                    serial,
                    state,
                };
            },
        )
        .filter(
            (
                device,
            ) =>
                device !==
                null,
        );
}

async function getDeviceProperties(
    serial,
) {
    const [
        modelResult,
        versionResult,
    ] =
        await Promise.all([
            execFileAsync(
                ADB_COMMAND,
                [
                    "-s",
                    serial,
                    "shell",
                    "getprop",
                    "ro.product.model",
                ],
            ),

            execFileAsync(
                ADB_COMMAND,
                [
                    "-s",
                    serial,
                    "shell",
                    "getprop",
                    "ro.build.version.release",
                ],
            ),
        ]);

    return {
        model:
            modelResult.stdout.trim(),

        version:
            versionResult.stdout.trim(),
    };
}

export async function listAndroidDevices() {
    const {
        stdout,
    } =
        await execFileAsync(
            ADB_COMMAND,
            [
                "devices",
            ],
        );

    const devices =
        parseAdbDevices(
            stdout,
        );

    const normalized =
        await Promise.all(
            devices.map(
                async (
                    device,
                ) => {
                    try {
                        const properties =
                            await getDeviceProperties(
                                device.serial,
                            );

                        return normalizeDevice(
                            device,
                            properties,
                        );
                    } catch {
                        return null;
                    }
                },
            ),
        );

    return normalized.filter(
        (
            device,
        ) =>
            device !==
            null,
    );
}
