import { CornerDownLeft } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const pressReturnPlugin: NodePlugin = {
    type: "pressReturn",

    title: "Press Return",

    subtitle: "Press keyboard return key",

    color: "#8B5CF6",

    icon: CornerDownLeft,

    supportedPlatforms: [
        "cross-platform",
    ],

    category: "interaction",

    defaults: {
        action: "pressReturn",
    },

    fields: [],

    handles: {
        outputs: ["next"],
    },

    preview(data: FlowNodeData) {
        if (
            data.action !==
            "pressReturn"
        ) {
            return null;
        }

        return (
            <div
                style={{
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 14,
                }}
            >
                Press Return
            </div>
        );
    },
};