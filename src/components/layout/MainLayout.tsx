import { TopBar } from "../topbar/TopBar";
import { Sidebar } from "../sidebar/Sidebar";
import { FlowCanvas } from "../../features/flow/components/canvas/FlowCanvas";
import { Toolbar } from "../../features/flow/components/toolbar/Toolbar";
import { ConsolePanel } from "../console/ConsolePanel";
import { StatusBar } from "../statusbar/StatusBar";
import { InspectorPanel } from "../inspector/InspectorPanel";


export function MainLayout() {
  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr 180px 32px",
        background: "#0D1117",
      }}
    >
      <TopBar />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr 420px",
          overflow: "hidden",
          minHeight: 0, // penting
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
            borderLeft: "1px solid #30363D",
            background: "#0D1117",
          }}
        >
          <InspectorPanel />
        </div>
      </div>

      <ConsolePanel />

      <StatusBar />
    </div>
  );
}