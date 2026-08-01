import { MoveHorizontal } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const swipeNode: NodePlugin = {
    type: "swipe",

    title: "Swipe",

    subtitle: "Swipe on screen",

    color: "#3B82F6",

    icon: MoveHorizontal,

    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "interaction",

    defaults: {
        action: "swipe",
        direction: "up",
        distance: 70,
        duration: 500,
    },

    fields: [
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
            label: "Distance (%)",
            type: "number",
            placeholder: "0-100",
            min: 0,
            max: 100,
            step: 1,
        },

        {
            key: "duration",
            label: "Duration (ms)",
            type: "text",
        },
    ],

    handles: {
        outputs: ["next"],
    },

    preview(data: FlowNodeData) {
        if (data.action !== "swipe") {
            return null;
        }

        const arrow = {
            up: "⬆",
            down: "⬇",
            left: "⬅",
            right: "➡",
        }[data.direction];

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    fontSize: 14,
                }}
            >
                <strong>
                    {arrow} Swipe {data.direction}
                </strong>

                <span>
                    {data.distance}% • {data.duration} ms
                </span>
            </div>
        );
    },
};