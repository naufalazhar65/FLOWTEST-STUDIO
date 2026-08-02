import { PowerOff } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { CloseAppNodeData } from "../../types/flowNode";

export const closeAppPlugin: NodePlugin = {
  type: "closeApp",

  title: "Close App",

  subtitle: "Terminate an application",

  color: "#EF4444",

  icon: PowerOff,

  supportedPlatforms: [
    "android",
    "ios",
  ],

  category: "device",

  defaults: {
    action: "closeApp",

    platform: "Android",

    // Android
    appPackage: "",

    // iOS
    bundleId: "",
  },

  fields: [
    {
      key: "platform",
      label: "Platform",
      type: "select",
      options: [
        "Android",
        "iOS",
      ],
    },

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
      key: "bundleId",
      label: "Bundle ID",
      type: "text",
      placeholder: "com.demo.app",
      visibleWhen: {
        platform: "iOS",
      },
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

        {app.platform ===
          "Android" ? (
          <span>
            Package:
            <br />
            <strong>
              {app.appPackage ||
                "-"}
            </strong>
          </span>
        ) : (
          <span>
            Bundle ID:
            <br />
            <strong>
              {app.bundleId ||
                "-"}
            </strong>
          </span>
        )}
      </div>
    );
  },
};

export default closeAppPlugin;