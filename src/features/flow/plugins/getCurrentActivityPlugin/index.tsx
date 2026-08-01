import { Activity } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const getCurrentActivityPlugin: NodePlugin = {
    type: "getCurrentActivity",

    title: "Get Current Activity",

    subtitle: "Retrieve current Android activity",

    color: "#22C55E",

    icon: Activity,

    supportedPlatforms: [
        "android",
    ],

    category: "device",

    defaults: {
        action: "getCurrentActivity",
        variableName: "",
    },

    fields: [
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
        if (data.action !== "getCurrentActivity") {
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
                    Get Current Activity
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 13,
                    }}
                >
                    Current Android Activity
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