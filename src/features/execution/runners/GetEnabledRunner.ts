import type { GetEnabledNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";

export const getEnabledRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getEnabled") {
            return;
        }

        const data = node.data as GetEnabledNodeData;

        return executeGetter(
            () =>
                appiumClient.isEnabled(
                    data.locatorStrategy,
                    data.locator,
                ),
            {   
                variableName: data.variableName,
                label: "Element Enabled",
            },
        );
    },
};