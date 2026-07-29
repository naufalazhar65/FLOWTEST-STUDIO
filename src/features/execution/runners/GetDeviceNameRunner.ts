import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeDeviceGetter } from "../utils/executeDeviceGetter";

export const getDeviceNameRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getDeviceName") {
            return;
        }

        return executeDeviceGetter(
            () => appiumClient.getDeviceName(),
            node.data.variableName,
            "Device Name",
        );
    },
};