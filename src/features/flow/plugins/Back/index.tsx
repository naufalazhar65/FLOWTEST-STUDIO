import { ArrowLeft } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";

export const backPlugin: NodePlugin = {
  type: "back",

  title: "Back",

  subtitle: "Press Android Back button",

  color: "#F59E0B",

  icon: ArrowLeft,

  defaults: {
    action: "back",
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
        <strong>⬅ Back</strong>

        <span>
          Press Android Back button
        </span>
      </div>
    );
  },
};