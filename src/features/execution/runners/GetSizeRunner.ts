import { appiumClient } from "../services/AppiumClient";

import { executeGetter } from "../utils/executeGetter";

import type { NodeRunner } from "../types/NodeRunner";

import type { GetSizeNodeData } from "../../flow/types/flowNode";

export const getSizeRunner: NodeRunner<GetSizeNodeData> = {
    async run(node) {
        return executeGetter(
            () =>
                appiumClient.getSize(
                    node.data.locatorStrategy,
                    node.data.locator,
                ),
            {
                variableName: node.data.variableName,
                label: "Size",
            },
        );
    },
};