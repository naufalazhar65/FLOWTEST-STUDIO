import { Type } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const getTextPlugin: NodePlugin = {
    type: "getText",

    title: "Get Text",

    subtitle: "Retrieve text from an element",

    color: "#8B5CF6",

    icon: Type,

    defaults: {
        action: "getText",
        locatorStrategy: "accessibility id",
        locator: "",
        variableName: "",
    },

    fields: [
        {
            key: "locatorStrategy",
            label: "Locator Strategy",
            type: "select",
            options: [
                "accessibility id",
                "id",
                "xpath",
                "class name",
                "android uiautomator",
                "-ios predicate string",
                "-ios class chain",
            ],
        },
        {
            key: "locator",
            label: "Locator",
            type: "text",
        },
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
        if (data.action !== "getText") {
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
                    Get Text
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 12,
                    }}
                >
                    {data.locatorStrategy}
                </div>

                <div
                    style={{
                        color: "#CBD5E1",
                        fontSize: 12,
                    }}
                >
                    {data.locator || "(locator)"}
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