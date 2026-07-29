import { PowerOff } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { CloseAppNodeData } from "../../types/flowNode";

export const closeAppPlugin: NodePlugin = {
  type: "closeApp",

  title: "Close App",

  subtitle: "Terminate an application",

  color: "#EF4444",

  icon: PowerOff,

  defaults: {
    action: "closeApp",

    appPackage: "",
  },

  fields: [
    {
      key: "appPackage",
      label: "App Package",
      type: "text",
      placeholder: "com.demo.app",
    },
  ],
  
  handles: {
    outputs: ["next"],
  },

  preview(data) {
    const app = data as CloseAppNodeData;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <strong>📴 Close App</strong>

        <span>
          Package:
          <br />
          {app.appPackage || "-"}
        </span>
      </div>
    );
  },
};