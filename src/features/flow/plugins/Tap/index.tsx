import { MousePointerClick } from "lucide-react";
import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const tapNode: NodePlugin = {
  type: "tap",

  title: "Tap",

  subtitle: "Tap an element",

  color: "#22C55E",

  icon: MousePointerClick,

  defaults: {
    action: "tap",
    locatorStrategy: "id",
    locator: "",
  },

  fields: [
    {
      key: "locatorStrategy",
      label: "Locator Strategy",
      type: "select",
      options: ["id", "xpath", "accessibilityId"],
    },
    {
      key: "locator",
      label: "Locator",
      type: "text",
    },
  ],

  handles: {
    outputs: ["next"],
  },

  preview(data: FlowNodeData) {
    if (data.action !== "tap") {
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
          Tap element
        </div>

        <div
          style={{
            color: "#94A3B8",
            fontSize: 13,
          }}
        >
          {data.locatorStrategy}={data.locator || "-"}
        </div>
      </>
    );
  },
};