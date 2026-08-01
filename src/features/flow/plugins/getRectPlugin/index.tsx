import { Scan } from "lucide-react";

import type { FlowNodeData } from "../../types/flowNode";
import type { NodePlugin } from "../../types/NodePlugin";

import { createElementGetterPreview } from "../shared/createElementGetterPreview";

export const getRectPlugin: NodePlugin = {
    type: "getRect",

    title: "Get Rect",

    subtitle: "Read element bounds",

    color: "#14B8A6",

    icon: Scan,

    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "element",

    defaults: {
        action: "getRect",
        locatorStrategy: "id",
        locator: "",
        variableName: "",
    },

    handles: {
        outputs: ["next"],
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

    preview(data: FlowNodeData) {
        if (data.action !== "getRect") {
            return null;
        }

        return createElementGetterPreview({
            title: "Get Rect",
            locatorStrategy: data.locatorStrategy,
            locator: data.locator,
            variableName: data.variableName,
        });
    },
};