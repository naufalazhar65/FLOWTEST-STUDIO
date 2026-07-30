import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";

export const getDeviceNameRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getDeviceName") {
            return;
        }

        return executeGetter(
            () => appiumClient.getDeviceName(),
            {
                variableName: node.data.variableName,
                label: "Device Name",
            },
        );
    },
};