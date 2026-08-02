import { Move } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const dragPlugin: NodePlugin = {
    type: "drag",

    title: "Drag",

    subtitle: "Drag an element",

    color: "#22C55E",

    icon: Move,

    supportedPlatforms: [
        "android",
        "ios",
    ],

    category: "interaction",

    defaults: {
        action: "drag",

        locatorStrategy: "id",

        locator: "",

        direction: "down",

        distance: 500,

        duration: 800,
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
            placeholder: "com.demo:id/card",
        },

        {
            key: "direction",
            label: "Direction",
            type: "select",
            options: [
                "up",
                "down",
                "left",
                "right",
            ],
        },

        {
            key: "distance",
            label: "Distance (px)",
            type: "number",
            placeholder: "500",
        },

        {
            key: "duration",
            label: "Duration (ms)",
            type: "number",
            placeholder: "800",
        },
    ],

    handles: {
        outputs: [
            "next",
        ],
    },

    preview(data: FlowNodeData) {
        if (data.action !== "drag") {
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
                    Drag
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
                        marginTop: 6,
                        color: "#94A3B8",
                        fontSize: 12,
                    }}
                >
                    Direction: {data.direction}
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 12,
                    }}
                >
                    Distance: {data.distance}px
                </div>

                <div
                    style={{
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