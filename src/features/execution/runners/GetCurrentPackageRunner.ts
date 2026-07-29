import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeDeviceGetter } from "../utils/executeDeviceGetter";

export const getCurrentPackageRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getCurrentPackage") {
            return;
        }

        return executeDeviceGetter(
    () => appiumClient.getCurrentPackage(),
    node.data.variableName,
    "Current Package",
);
    },
};