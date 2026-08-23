import {
    listIOSSimulators,
} from "./ios/simctl.mjs";

export async function discoverDevices() {
    const simulators =
        await listIOSSimulators();

    return simulators;
}
