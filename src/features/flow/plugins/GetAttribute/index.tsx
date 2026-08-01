import { Tags } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const getAttributeNode: NodePlugin = {
    type: "getAttribute",

    title: "Get Attribute",

    subtitle: "Read element attribute",

    color: "#8B5CF6",

    icon: Tags,

    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "element",

    defaults: {
        action: "getAttribute",
        locatorStrategy: "id",
        locator: "",
        attribute: "content-desc",
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
            key: "attribute",
            label: "Attribute",
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
        if (data.action !== "getAttribute") {
            return null;
        }

        return (
            <>
                <div
                    style={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: 14,
                    }}
                >
                    Get Attribute
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 13,
                    }}
                >
                    {data.locatorStrategy}={data.locator || "-"}
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 12,
                    }}
                >
                    Attribute: {data.attribute || "-"}
                </div>

                <div
                    style={{
                        color: "#64748B",
                        fontSize: 12,
                    }}
                >
                    → {data.variableName || "(variable)"}
                </div>
            </>
        );
    },
};