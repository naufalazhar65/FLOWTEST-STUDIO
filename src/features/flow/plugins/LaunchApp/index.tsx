import { Smartphone } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { LaunchAppNodeData } from "../../types/flowNode";

export const launchAppPlugin: NodePlugin = {
  type: "launchApp",

  title: "Launch App",

  subtitle: "Launch an application on the device",

  color: "#3B82F6",

  icon: Smartphone,

  defaults: {
    action: "launchApp",

    appPackage: "",

    appActivity: "",

    noReset: true,
  },

  fields: [
    {
      key: "appPackage",
      label: "App Package",
      type: "text",
      placeholder: "com.demo.app",
    },

    {
      key: "appActivity",
      label: "App Activity",
      type: "text",
      placeholder: ".MainActivity",
    },

    {
      key: "noReset",
      label: "No Reset",
      type: "checkbox",
    },
  ],

  preview(data) {
    const launch =
      data as LaunchAppNodeData;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <strong>📱 Launch App</strong>

        <span>
          Package:
          <br />
          {launch.appPackage || "-"}
        </span>

        <span>
          Activity:
          <br />
          {launch.appActivity || "-"}
        </span>

        <span>
          No Reset:{" "}
          {launch.noReset
            ? "Yes"
            : "No"}
        </span>
      </div>
    );
  },
};