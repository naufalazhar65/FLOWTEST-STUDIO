import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";

export const getPlatformVersionRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getPlatformVersion") {
            return;
        }

        return executeGetter(
            () => appiumClient.getPlatformVersion(),
            {
                variableName: node.data.variableName,
                label: "Platform Version",
            },
        );
    },
};