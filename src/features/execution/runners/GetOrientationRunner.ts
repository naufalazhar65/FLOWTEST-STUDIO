import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";

export const getOrientationRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getOrientation") {
            return;
        }

        return executeGetter(
            () => appiumClient.getOrientation(),
            {
                variableName: node.data.variableName,
                label: "Orientation",
            },
        );
    },
};