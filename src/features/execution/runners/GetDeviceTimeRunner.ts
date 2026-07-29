import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeDeviceGetter } from "../utils/executeDeviceGetter";

export const getDeviceTimeRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getDeviceTime") {
            return;
        }

        return executeDeviceGetter(
            () => appiumClient.getDeviceTime(),
            node.data.variableName,
            "Device Time",
        );
    },
};