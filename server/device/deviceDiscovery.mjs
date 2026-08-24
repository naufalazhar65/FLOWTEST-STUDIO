import {
    listIOSSimulators,
} from "./ios/simctl.mjs";

import {
    listIOSPhysicalDevices,
} from "./ios/devicectl.mjs";

import {
    listAndroidDevices,
} from "./android/adb.mjs";

export async function discoverDevices() {
    const [
        simulators,
        physicalDevices,
        androidDevices,
    ] = await Promise.all([
        listIOSSimulators(),
        listIOSPhysicalDevices(),
        listAndroidDevices(),
    ]);

    return [
        ...simulators,
        ...physicalDevices,
        ...androidDevices,
    ];
}