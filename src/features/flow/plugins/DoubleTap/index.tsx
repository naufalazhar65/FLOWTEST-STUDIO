import { MousePointer2 } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const doubleTapPlugin: NodePlugin = {
    type: "doubleTap",

    title: "Double Tap",

    subtitle: "Double tap an element",

    color: "#22C55E",

    icon: MousePointer2,

    supportedPlatforms: [
        "android",
        "ios",
    ],

    category: "interaction",

    defaults: {
        action: "doubleTap",

        locatorStrategy: "id",

        locator: "",
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
    ],

    handles: {
        outputs: [
            "next",
        ],
    },

    preview(data: FlowNodeData) {
        if (data.action !== "doubleTap") {
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
                    Double Tap
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
            </>
        );
    },
};