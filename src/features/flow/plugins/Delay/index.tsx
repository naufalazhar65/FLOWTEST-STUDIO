import { Timer } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const delayNode: NodePlugin = {
    type: "delay",

    title: "Delay",

    subtitle: "Wait before next action",

    color: "#F59E0B",

    icon: Timer,

    defaults: {
        action: "delay",
        duration: 1000,
    },

    fields: [
        {
            key: "duration",
            label: "Duration (ms)",
            type: "number",
            placeholder: "1000",
            min: 1,
            step: 100,
        },
    ],

    preview(data: FlowNodeData) {
        if (data.action !== "delay") {
            return null;
        }

        return (
            <div
                style={{
                    color: "#FCD34D",
                    fontWeight: 700,
                    fontSize: 15,
                }}
            >
                ⏱ {data.duration} ms
            </div>
        );
    },
};