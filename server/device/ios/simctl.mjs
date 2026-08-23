import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync =
    promisify(execFile);

const SIMCTL_COMMAND =
    "xcrun";

const SIMCTL_ARGS = [
    "simctl",
    "list",
    "devices",
    "available",
    "--json",
];

function normalizeRuntimeVersion(
    runtimeIdentifier,
) {
    const match =
        /^com\.apple\.CoreSimulator\.SimRuntime\.iOS-(.+)$/
            .exec(runtimeIdentifier);

    if (!match) {
        return "Unknown";
    }

    return match[1].replace(
        /-/g,
        ".",
    );
}

function normalizeDevice(
    device,
    runtimeIdentifier,
) {
    return {
        id: device.udid,

        name: device.name,

        platform: "ios",

        version:
            normalizeRuntimeVersion(
                runtimeIdentifier,
            ),

        udid: device.udid,

        status:
            device.state === "Booted"
                ? "connected"
                : "offline",

        emulator: true,
    };
}

export function parseSimctlDevices(
    output,
) {
    const data =
        JSON.parse(output);

    const devices =
        data?.devices;

    if (
        !devices ||
        typeof devices !==
            "object"
    ) {
        return [];
    }

    return Object.entries(
        devices,
    ).flatMap(
        ([
            runtimeIdentifier,
            runtimeDevices,
        ]) => {
            if (
                !Array.isArray(
                    runtimeDevices,
                )
            ) {
                return [];
            }

            return runtimeDevices
                .filter(
                    (device) =>
                        device &&
                        device.isAvailable ===
                            true &&
                        typeof device.udid ===
                            "string" &&
                        typeof device.name ===
                            "string",
                )
                .map(
                    (device) =>
                        normalizeDevice(
                            device,
                            runtimeIdentifier,
                        ),
                );
        },
    );
}

export async function listIOSSimulators() {
    const {
        stdout,
    } =
        await execFileAsync(
            SIMCTL_COMMAND,
            SIMCTL_ARGS,
        );

    return parseSimctlDevices(
        stdout,
    );
}
