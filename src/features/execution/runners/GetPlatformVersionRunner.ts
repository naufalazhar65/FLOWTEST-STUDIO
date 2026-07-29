import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeDeviceGetter } from "../utils/executeDeviceGetter";

export const getPlatformVersionRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getPlatformVersion") {
            return;
        }

        return executeDeviceGetter(
            () => appiumClient.getPlatformVersion(),
            node.data.variableName,
            "Platform Version",
        );
    },
};