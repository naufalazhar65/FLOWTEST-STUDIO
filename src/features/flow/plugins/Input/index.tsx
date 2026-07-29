import { Keyboard } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const inputNode: NodePlugin = {
  type: "input",

  title: "Input",

  subtitle: "Input text",

  color: "#3B82F6",

  icon: Keyboard,

  defaults: {
    action: "input",
    locatorStrategy: "id",
    locator: "",
    text: "",
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
      key: "text",
      label: "Text",
      type: "text",
    },
  ],

  handles: {
    outputs: ["next"],
  },

  preview(data: FlowNodeData) {
    if (data.action !== "input") {
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
          Input text
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
          {data.text || "-"}
        </div>
      </div>
    );
  },
};