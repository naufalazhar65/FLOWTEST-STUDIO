import { CheckSquare } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const getSelectedPlugin: NodePlugin = {
    type: "getSelected",

    title: "Get Selected",

    subtitle: "Check if element is selected",

    color: "#3B82F6",

    icon: CheckSquare,

    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "element",

    defaults: {
        action: "getSelected",
        locatorStrategy: "id",
        locator: "",
        variableName: "",
    },

    fields: [
        {
            key: "locatorStrategy",
            label: "Locator Strategy",
            type: "select",
            options: ["id", "xpath", "accessibilityId"],
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
        if (data.action !== "getSelected") {
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
                    Get Selected
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