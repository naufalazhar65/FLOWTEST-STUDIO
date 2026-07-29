import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { executeElementGetter } from "../utils/executeElementGetter";
import { resolveVariables } from "../variables/resolveVariable";

import { isGetTextNode } from "../../flow/utils/nodeGuards";

export const getTextRunner: NodeRunner = {
    async run(node) {
        if (!isGetTextNode(node)) {
            return;
        }

        const locator = resolveVariables(node.data.locator);

        return executeElementGetter(
            () =>
                appiumClient.getText(
                    node.data.locatorStrategy,
                    locator,
                ),
            node.data.variableName,
            "Text",
        );
    },
};