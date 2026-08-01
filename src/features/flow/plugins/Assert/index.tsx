import { BadgeCheck } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const assertNode: NodePlugin = {
  type: "assert",

  title: "Assert",

  subtitle: "Verify value",

  color: "#F59E0B",

  icon: BadgeCheck,

  // Sidebar metadata
  supportedPlatforms: [
    "cross-platform",
  ],

  category: "interaction",

  defaults: {
    action: "assert",
    actual: "",
    operator: "equals",
    expected: "",
  },

  fields: [
    {
      key: "actual",
      label: "Actual",
      type: "text",
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
    },
  ],

  handles: {
    outputs: ["next"],
  },

  preview(data: FlowNodeData) {
    if (data.action !== "assert") {
      return null;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginTop: 8,
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Verify value
        </div>

        <div
          style={{
            color: "#94A3B8",
            fontSize: 13,
            wordBreak: "break-word",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            <div>
              Actual: {String(data.actual || "-")}
            </div>

            <div>
              Operator: {data.operator}
            </div>

            <div>
              Expected: {String(data.expected || "-")}
            </div>
          </div>
        </div>

        <div
          style={{
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            wordBreak: "break-word",
          }}
        >
          Expected: {data.expected || "-"}
        </div>
      </div>
    );
  },
};