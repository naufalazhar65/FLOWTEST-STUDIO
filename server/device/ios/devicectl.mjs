import {
    mkdtemp,
    readFile,
    rm,
} from "node:fs/promises";

import {
    tmpdir,
} from "node:os";

import {
    join,
} from "node:path";

import {
    execFile,
} from "node:child_process";

import {
    promisify,
} from "node:util";

const execFileAsync =
    promisify(execFile);

const DEVICECTL_COMMAND =
    "xcrun";

function normalizeDeviceStatus(
    tunnelState,
) {
    if (
        tunnelState ===
        "connected"
    ) {
        return "connected";
    }

    return "offline";
}

function normalizeDevice(
    device,
) {
    const name =
        device?.deviceProperties?.name;

    const version =
        device?.deviceProperties
            ?.osVersionNumber;

    const udid =
        device?.hardwareProperties?.udid;

    const identifier =
        device?.identifier;

    const platform =
        device?.hardwareProperties
            ?.platform;

    const reality =
        device?.hardwareProperties
            ?.reality;

    if (
        typeof name !==
            "string" ||
        typeof version !==
            "string" ||
        typeof udid !==
            "string" ||
        typeof identifier !==
            "string" ||
        platform !== "iOS" ||
        reality !== "physical"
    ) {
        return null;
    }

    return {
        id:
            identifier,

        name,

        platform:
            "ios",

        version,

        udid,

        status:
            normalizeDeviceStatus(
                device
                    ?.connectionProperties
                    ?.tunnelState,
            ),

        emulator:
            false,
    };
}

export function parseDevicectlDevices(
    output,
) {
    const data =
        JSON.parse(output);

    const devices =
        data?.result?.devices;

    if (
        !Array.isArray(
            devices,
        )
    ) {
        return [];
    }

    return devices
        .map(
            normalizeDevice,
        )
        .filter(
            (
                device,
            ) =>
                device !== null,
        );
}

export async function listIOSPhysicalDevices() {
    const directory =
        await mkdtemp(
            join(
                tmpdir(),
                "flowtest-devicectl-",
            ),
        );

    const outputPath =
        join(
            directory,
            "devices.json",
        );

    try {
        await execFileAsync(
                    DEVICECTL_COMMAND,
                            [
                "devicectl",
                "list",
                "devices",
                "--json-output",
                outputPath,
            ],
        );

        const output =
            await readFile(
                outputPath,
                "utf8",
            );

        return parseDevicectlDevices(
            output,
        );
    } finally {
        await rm(
            directory,
            {
                recursive: true,
                force: true,
            },
        );
    }
}