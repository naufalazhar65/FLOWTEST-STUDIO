import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";

export const getCurrentPackageRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getCurrentPackage") {
            return;
        }

        return executeGetter(
            () => appiumClient.getCurrentPackage(),
            {
                variableName: node.data.variableName,
                label: "Current Package",
            },
        );
    },
};