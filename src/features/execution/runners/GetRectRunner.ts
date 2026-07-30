import { appiumClient } from "../services/AppiumClient";
import { executeGetter } from "../utils/executeGetter";

import type { NodeRunner } from "../types/NodeRunner";
import type { GetRectNodeData } from "../../flow/types/flowNode";

export const getRectRunner: NodeRunner<GetRectNodeData> = {
    async run(node) {
        return executeGetter(
            () =>
                appiumClient.getRect(
                    node.data.locatorStrategy,
                    node.data.locator,
                ),
            {
                variableName: node.data.variableName,
                label: "Rect",
            },
        );
    },
};