import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { setVariable } from "../variables/VariableStore";

export const getTextRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getText") {
            return;
        }

        const text = await appiumClient.getText(
            node.data.locatorStrategy,
            node.data.locator
        );

        if (node.data.variableName.trim()) {
            setVariable(
                node.data.variableName,
                text
            );
        }

        return {
            outputs: ["next"],
        };
    },
};