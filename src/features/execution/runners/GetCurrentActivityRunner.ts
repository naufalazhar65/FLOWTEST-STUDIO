import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";

export const getCurrentActivityRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getCurrentActivity") {
            return;
        }

        return executeGetter(
            () => appiumClient.getCurrentActivity(),
            {
                variableName: node.data.variableName,
                label: "Current Activity",
            },
        );
    },
};