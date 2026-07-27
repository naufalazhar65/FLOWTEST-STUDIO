import { Variable } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlowNodeData } from "../../types/flowNode";

export const setVariableNode: NodePlugin = {
  type: "setVariable",

  title: "Set Variable",

  subtitle: "Store runtime variable",

  color: "#8B5CF6",

  icon: Variable,

  defaults: {
  action: "setVariable",
  variableName: "",
  value: "",
},

  fields: [
    {
      key: "variableName",
      label: "Variable Name",
      type: "text",
    },
    {
      key: "value",
      label: "Value",
      type: "text",
    },
  ],

  preview(data: FlowNodeData) {
    if (data.action !== "setVariable") {
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
          {data.variableName || "-"}
        </div>

        <div
          style={{
            color: "#94A3B8",
            fontSize: 13,
            wordBreak: "break-word",
          }}
        >
          {data.value || "-"}
        </div>
      </div>
    );
  },
};