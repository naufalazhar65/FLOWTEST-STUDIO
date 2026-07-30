import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";

export const elementExistsRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "elementExists") {
            return;
        }

        const exists = await appiumClient.elementExists(
            node.data.locatorStrategy,
            node.data.locator
        );

        storeResult(
            node.data.variableName,
            exists,
        );
        

        return {
            outputs: ["next"],
        };
    },
};