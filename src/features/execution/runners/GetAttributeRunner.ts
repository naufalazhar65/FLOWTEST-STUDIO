import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";
import { resolveVariables } from "../variables/resolveVariable";

export const getAttributeRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getAttribute") {
            return;
        }

        const locator = resolveVariables(node.data.locator);

        const attribute = resolveVariables(node.data.attribute);

        const value = await appiumClient.getAttribute(
            node.data.locatorStrategy,
            locator,
            attribute,
        );

        storeResult(
            node.data.variableName,
            value,
        );

        return {
            outputs: ["next"],
        };
    },
};