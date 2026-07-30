import { appiumClient } from "../services/appium/AppiumClient";

import { executeGetter } from "../utils/executeGetter";

import type { NodeRunner } from "../types/NodeRunner";

import type { GetLocationNodeData } from "../../flow/types/flowNode";

export const getLocationRunner: NodeRunner<GetLocationNodeData> = {
    async run(node) {
        return executeGetter(
            () =>
                appiumClient.getLocation(
                    node.data.locatorStrategy,
                    node.data.locator,
                ),
            {
                variableName: node.data.variableName,
                label: "Location",
            },
        );
    },
};