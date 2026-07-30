import type { GetSelectedNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";

export const getSelectedRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getSelected") {
            return;
        }

        const data = node.data as GetSelectedNodeData;

        return executeGetter(
            () =>
                appiumClient.isSelected(
                    data.locatorStrategy,
                    data.locator,
                ),
            {
                variableName: data.variableName,
                label: "Element Selected",
            },
        );
    },
};