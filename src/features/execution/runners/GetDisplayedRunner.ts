import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";
import type { GetDisplayedNodeData } from "../../flow/types/flowNode";

export const getDisplayedRunner: NodeRunner<GetDisplayedNodeData> = {
    async run(node) {
        return executeGetter(
            () =>
                appiumClient.isDisplayed(
                    node.data.locatorStrategy,
                    node.data.locator,
                ),
            {
                variableName: node.data.variableName,
                label: "Element Displayed",
            },
        );
    },
};