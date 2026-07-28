import { GitBranch } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { IfNodeData } from "../../types/flowNode";

export const ifPlugin: NodePlugin = {
  type: "if",

  title: "If",

  subtitle: "Conditional branching",

  color: "#F59E0B",

  icon: GitBranch,

  defaults: {
    action: "if",

    condition: "",
  },

  fields: [
    {
      key: "condition",
      label: "Condition",
      type: "text",
      placeholder: '${status} == "success"',
    },
  ],

  preview(data) {
    const condition =
      data as IfNodeData;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <strong>🔀 IF</strong>

        <span>
          {condition.condition || "-"}
        </span>
      </div>
    );
  },
};