import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeDeviceGetter } from "../utils/executeDeviceGetter";

export const getCurrentActivityRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getCurrentActivity") {
            return;
        }

        return executeDeviceGetter(
            () => appiumClient.getCurrentActivity(),
            node.data.variableName,
            "Current Activity",
        );
    },
};