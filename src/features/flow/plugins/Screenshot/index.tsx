import { Camera } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { ScreenshotNodeData } from "../../types/flowNode";

export const screenshotPlugin: NodePlugin = {
  type: "screenshot",

  title: "Screenshot",

  subtitle: "Capture device screen",

  color: "#8B5CF6",

  icon: Camera,

  defaults: {
    action: "screenshot",

    fileName: "",
  },

  fields: [
    {
      key: "fileName",
      label: "Screenshot Name",
      type: "text",
      placeholder: "login-success",
    },
  ],

  preview(data) {
    const screenshot =
      data as ScreenshotNodeData;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <strong>📸 Screenshot</strong>

        <span>
          Name:
          <br />
          {screenshot.fileName || "-"}
        </span>
      </div>
    );
  },
};