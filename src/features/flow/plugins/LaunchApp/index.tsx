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

    // Android
    appPackage: "",
    appActivity: "",

    // iOS
    bundleId: "",
    app: "",

    // Shared
    noReset: true,
  },

  fields: [
    {
      key: "appPackage",
      label: "App Package",
      type: "text",
      placeholder: "com.demo.app",
      visibleWhen: {
        platform: "Android",
      },
    },

    {
      key: "appActivity",
      label: "App Activity",
      type: "text",
      placeholder: ".MainActivity",
      visibleWhen: {
        platform: "Android",
      },
    },

    {
      key: "bundleId",
      label: "Bundle ID",
      type: "text",
      placeholder: "com.demo.app",
      visibleWhen: {
        platform: "iOS",
      },
    },

    {
      key: "app",
      label: "App (.app / .ipa)",
      type: "text",
      placeholder: "/Users/username/MyApp.app",
      visibleWhen: {
        platform: "iOS",
      },
    },

    {
      key: "noReset",
      label: "No Reset",
      type: "checkbox",
    },
  ],

  handles: {
    outputs: ["next"],
  },

  preview(data) {
    const launch = data as LaunchAppNodeData;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <strong>📱 Launch App</strong>

        {launch.appPackage && (
          <span>
            Package:
            <br />
            {launch.appPackage}
          </span>
        )}

        {launch.appActivity && (
          <span>
            Activity:
            <br />
            {launch.appActivity}
          </span>
        )}

        {launch.bundleId && (
          <span>
            Bundle ID:
            <br />
            {launch.bundleId}
          </span>
        )}

        {launch.app && (
          <span>
            App:
            <br />
            {launch.app}
          </span>
        )}

        <span>
          No Reset: {launch.noReset ? "Yes" : "No"}
        </span>
      </div>
    );
  },
};