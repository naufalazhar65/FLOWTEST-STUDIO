import { GitBranch } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { IfNodeData } from "../../types/flowNode";

export const ifPlugin: NodePlugin = {
    type: "if",

    title: "If",

    subtitle: "Conditional branching",

    color: "#F59E0B",

    icon: GitBranch,

    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "logic",

    defaults: {
        action: "if",
        actual: "",
        operator: "equals",
        expected: "",
    },

    fields: [
        {
            key: "actual",
            label: "Actual",
            type: "text",
            placeholder: "${status}",
        },
        {
            key: "operator",
            label: "Operator",
            type: "select",
            options: [
                "equals",
                "notEquals",
                "contains",
                "notContains",
                "startsWith",
                "endsWith",
                "greaterThan",
                "greaterThanOrEqual",
                "lessThan",
                "lessThanOrEqual",
                "isTrue",
                "isFalse",
                "isEmpty",
                "isNotEmpty",
                "matches",
            ],
        },
        {
            key: "expected",
            label: "Expected",
            type: "text",
            placeholder: "success",
        },
    ],

    handles: {
        outputs: ["true", "false"],
    },

    preview(data) {
        const condition = data as IfNodeData;

        const actual = condition.actual || "(actual)";
        const expected = condition.expected || "(expected)";

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    🔀 IF
                </div>

                <div
                    style={{
                        fontSize: 12,
                        color: "#CBD5E1",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                    }}
                >
                    <div>{actual}</div>

                    <div
                        style={{
                            color: "#F59E0B",
                            fontWeight: 600,
                        }}
                    >
                        {condition.operator}
                    </div>

                    <div>{expected}</div>
                </div>

                <div
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        paddingTop: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        color: "#94A3B8",
                    }}
                >
                    <span>✅ True</span>

                    <span>❌ False</span>
                </div>
            </div>
        );
    },
};