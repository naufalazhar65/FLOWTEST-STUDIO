import { Smartphone } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const getOrientationPlugin: NodePlugin = {
    type: "getOrientation",

    title: "Get Orientation",

    subtitle: "Retrieve current device orientation",

    color: "#22C55E",

    icon: Smartphone,

    supportedPlatforms: [
        "cross-platform",
    ],

    category: "device",

    defaults: {
        action: "getOrientation",
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
        if (data.action !== "getOrientation") {
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
                    Get Orientation
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 13,
                    }}
                >
                    Current Device Orientation
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