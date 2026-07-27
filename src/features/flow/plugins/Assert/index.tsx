import { BadgeCheck } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const assertNode: NodePlugin = {
  type: "assert",

  title: "Assert",

  subtitle: "Verify value",

  color: "#F59E0B",

  icon: BadgeCheck,

  defaults: {
    action: "assert",
    locatorStrategy: "id",
    locator: "",
    expected: "",
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
    },
    {
      key: "expected",
      label: "Expected",
      type: "text",
    },
  ],

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
          {data.locatorStrategy}={data.locator || "-"}
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