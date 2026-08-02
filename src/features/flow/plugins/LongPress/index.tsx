import { Pointer } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const longPressPlugin: NodePlugin = {
    type: "longPress",

    title: "Long Press",

    subtitle: "Press and hold an element",

    color: "#22C55E",

    icon: Pointer,

    supportedPlatforms: [
        "android",
        "ios",
    ],

    category: "interaction",

    defaults: {
        action: "longPress",

        locatorStrategy: "id",

        locator: "",

        duration: 500,
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
            placeholder: "com.demo:id/button",
        },

        {
            key: "duration",
            label: "Duration (ms)",
            type: "number",
            placeholder: "500",
        },
    ],

    handles: {
        outputs: [
            "next",
        ],
    },

    preview(data: FlowNodeData) {
        if (data.action !== "longPress") {
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
                    Long Press
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 13,
                    }}
                >
                    {data.locatorStrategy}
                    =
                    {data.locator || "-"}
                </div>

                <div
                    style={{
                        marginTop: 4,
                        color: "#94A3B8",
                        fontSize: 12,
                    }}
                >
                    Duration: {data.duration} ms
                </div>
            </>
        );
    },
};