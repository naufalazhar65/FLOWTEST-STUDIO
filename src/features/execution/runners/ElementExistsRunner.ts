import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { getVariable, setVariable } from "../variables/VariableStore";

export const elementExistsRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "elementExists") {
            return;
        }

        const exists = await appiumClient.elementExists(
            node.data.locatorStrategy,
            node.data.locator
        );

        if (node.data.variableName.trim()) {
            setVariable(
                node.data.variableName,
                exists
            );
            console.log(
                "VARIABLE =",
                node.data.variableName,
                exists
            );
        }
        console.log(
            getVariable("loginVisible")
        );

        return {
            outputs: ["next"],
        };
    },
};