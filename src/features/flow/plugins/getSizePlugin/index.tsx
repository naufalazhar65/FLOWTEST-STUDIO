import { Ruler } from "lucide-react";

import type { FlowNodeData } from "../../types/flowNode";
import type { NodePlugin } from "../../types/NodePlugin";

import { createElementGetterPreview } from "../shared/createElementGetterPreview";

export const getSizePlugin: NodePlugin = {
    type: "getSize",

    title: "Get Size",

    subtitle: "Read element size",

    color: "#06B6D4",

    icon: Ruler,

    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "element",

    defaults: {
        action: "getSize",
        locatorStrategy: "id",
        locator: "",
        variableName: "",
    },

    fields: [
        {
            key: "locatorStrategy",
            label: "Locator Strategy",
            type: "select",
            options: [
                "id",
                "xpath",
                "accessibilityId",
            ],
        },
        {
            key: "locator",
            label: "Locator",
            type: "text",
        },
        {
            key: "variableName",
            label: "Variable Name",
            type: "text",
        },
    ],

    handles: {
        outputs: ["next"],
    },

    preview(data: FlowNodeData) {
        if (data.action !== "getSize") {
            return null;
        }

        return createElementGetterPreview({
            title: "Get Size",
            locatorStrategy: data.locatorStrategy,
            locator: data.locator,
            variableName: data.variableName,
        });
    },
};