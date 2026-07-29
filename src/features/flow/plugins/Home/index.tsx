import { House } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";

export const homePlugin: NodePlugin = {
  type: "home",

  title: "Home",

  subtitle: "Press Android Home button",

  color: "#10B981",

  icon: House,

  defaults: {
    action: "home",
  },

  handles: {
    outputs: ["next"],
  },

  fields: [],

  preview() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <strong>🏠 Home</strong>

        <span>
          Press Android Home button
        </span>
      </div>
    );
  },
};