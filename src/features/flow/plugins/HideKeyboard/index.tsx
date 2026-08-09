import { KeyboardOff } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const hideKeyboardplugin: NodePlugin = {
    type: "hideKeyboard",

    title: "Hide Keyboard",

    subtitle: "Dismiss the keyboard",

    color: "#F59E0B",

    icon: KeyboardOff,

    supportedPlatforms: [
        "cross-platform",
    ],

    category: "interaction",

    defaults: {
        action: "hideKeyboard",
    },

    fields: [],

    handles: {
        outputs: ["next"],
    },

    preview(data: FlowNodeData) {
        if (
            data.action !==
            "hideKeyboard"
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
                Hide keyboard
            </div>
        );
    },
};