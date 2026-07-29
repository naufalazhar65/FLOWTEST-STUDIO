import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeDeviceGetter } from "../utils/executeDeviceGetter";

export const getOrientationRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getOrientation") {
            return;
        }

        return executeDeviceGetter(
            () => appiumClient.getOrientation(),
            node.data.variableName,
            "Orientation",
        );
    },
};