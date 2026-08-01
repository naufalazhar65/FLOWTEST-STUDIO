import { useState } from "react";

import { TopBar } from "../topbar/TopBar";
import { Sidebar } from "../sidebar/Sidebar";
import { FlowCanvas } from "../../features/flow/components/canvas/FlowCanvas";
import { Toolbar } from "../../features/flow/components/toolbar/Toolbar";
import { ConsolePanel } from "../console/ConsolePanel";
import { StatusBar } from "../statusbar/StatusBar";
import { InspectorPanel } from "../inspector/InspectorPanel";
import { useEffect } from "react";
import { ExecutionBar } from "../../features/execution/components/ExecutionBar"

import { appiumConnectionService } from "../../features/execution/services/appium/AppiumConnectionService";

export function MainLayout() {

  useEffect(() => {
    appiumConnectionService.start();

    return () =>
      appiumConnectionService.stop();
  }, []);
  const [consoleExpanded, setConsoleExpanded] =
    useState(false);

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateRows: `auto 1fr ${consoleExpanded ? "220px" : "48px"
          } 32px`,
        background: "#0D1117",
        transition: "grid-template-rows .25s ease",
      }}
    >
      <TopBar />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "300px 1fr 420px",
          overflow: "hidden",
          minHeight: 0,
        }}
      >


        <Sidebar />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          <ExecutionBar />

          <Toolbar />

          <div
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <FlowCanvas />
          </div>
        </div>

        <div
          style={{
            overflow: "hidden",
            minHeight: 0,
            borderLeft:
              "1px solid #30363D",
            background: "#0D1117",
          }}
        >
          <InspectorPanel />
        </div>
      </div>

      <ConsolePanel
        expanded={consoleExpanded}
        onToggle={() =>
          setConsoleExpanded((v) => !v)
        }
      />

      <StatusBar />
    </div>
  );
}