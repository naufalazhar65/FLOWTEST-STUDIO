import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";

export const getDeviceTimeRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getDeviceTime") {
            return;
        }

        return executeGetter(
            () => appiumClient.getDeviceTime(),
            {
                variableName: node.data.variableName,
                label: "Device Time",
            },
        );
    },
};