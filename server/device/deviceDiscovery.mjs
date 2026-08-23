import {
    listIOSSimulators,
} from "./ios/simctl.mjs";

import {
    listIOSPhysicalDevices,
} from "./ios/devicectl.mjs";

export async function discoverDevices() {
    const [
        simulators,
        physicalDevices,
    ] = await Promise.all([
        listIOSSimulators(),
        listIOSPhysicalDevices(),
    ]);

    return [
        ...simulators,
        ...physicalDevices,
    ];
}