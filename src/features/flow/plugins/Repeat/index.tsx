import { Repeat } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { RepeatNodeData } from "../../types/flowNode";

export const repeatPlugin: NodePlugin = {
    type: "repeat",

    title: "Repeat",

    subtitle: "Repeat a flow section",

    color: "#06B6D4",

    icon: Repeat,

    supportedPlatforms: [
        "cross-platform",
    ],

    category: "logic",

    defaults: {
        action: "repeat",

        count: 3,
    },

    fields: [
        {
            key: "count",

            label: "Count",

            type: "number",

            min: 1,

            step: 1,

            placeholder: "3",
        },
    ],

    handles: {
        outputs: ["body", "next"],
    },

    preview(data) {
        const repeat =
            data as RepeatNodeData;

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,

                        fontWeight: 700,

                        fontSize: 14,
                    }}
                >
                    🔁 Repeat
                </div>

                <div
                    style={{
                        fontSize: 12,

                        color: "#CBD5E1",

                        lineHeight: 1.5,
                    }}
                >
                    Repeat{" "}
                    <strong>
                        {repeat.count || 0}
                    </strong>{" "}
                    times
                </div>
            </div>
        );
    },
};