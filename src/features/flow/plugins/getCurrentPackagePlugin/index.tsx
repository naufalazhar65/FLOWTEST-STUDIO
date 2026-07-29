import { Package } from "lucide-react";
import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const getCurrentPackagePlugin: NodePlugin = {
    type: "getCurrentPackage",

    title: "Get Current Package",

    subtitle: "Retrieve current Android Package",

    color: "#22C55E",

    icon: Package,

    defaults: {
        action: "getCurrentPackage",
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
        if (data.action !== "getCurrentPackage") {
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
                    Get Current Package
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 13,
                    }}
                >
                    Current Android Package
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