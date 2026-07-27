import { useCallback } from "react";
import {
  FolderOpen,
  Save,
  Play,
  Smartphone,
  Cpu,
  Download,
} from "lucide-react";

import { Button } from "../ui/Button";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { executeFlow } from "../../features/execution/engine/executeFlow";
import { useExecutionStore } from "../../features/execution/store/useExecutionStore";
import { exportProject } from "../../features/flow/services/exportService";
import { openJsonFile } from "../../features/flow/services/filePicker";
import { importProject } from "../../features/flow/services/importService";

export function TopBar() {
  const { nodes, edges, saveProject,
    loadProject, } = useFlowStore();

  const status = useExecutionStore(
    (state) => state.status
  );

  const handleRun = useCallback(async () => {
    try {
      await executeFlow(nodes, {
        device: "Android",
        edges,
      });
    } catch (error) {
      console.error(error);
    }
  }, [nodes, edges]);

  return (
    <header
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#161B22",
        borderBottom: "1px solid #30363D",
      }}
    >
      {/* Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "#7C5CFC",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          F
        </div>

        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            FlowTest Studio
          </div>

          <div
            style={{
              color: "#8B949E",
              fontSize: 12,
            }}
          >
            Mobile Automation Flow Builder
          </div>
        </div>
      </div>

      {/* Center */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "#0D1117",
            border: "1px solid #30363D",
            padding: "8px 14px",
            borderRadius: 10,
          }}
        >
          <Smartphone size={16} />
          Android
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "#0D1117",
            border: "1px solid #30363D",
            padding: "8px 14px",
            borderRadius: 10,
            color:
              status === "running"
                ? "#F59E0B"
                : "#3FB950",
          }}
        >
          <Cpu size={16} />
          {status === "running"
            ? "Running..."
            : "Appium Connected"}
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <Button
          onClick={async () => {
            const file = await openJsonFile();

            if (!file) return;

            const project =
              await importProject(file);

            loadProject(project);
          }}
        >
          <FolderOpen size={16} />
          Open
        </Button>

        <Button
          onClick={() =>
            exportProject(
              saveProject("Untitled")
            )
          }
        >
          <Save size={16} />
          Save
        </Button>

        <Button
          onClick={handleRun}
          disabled={status === "running"}
        >
          <Play size={16} />
          {status === "running"
            ? "Running..."
            : "Run"}
        </Button>

        <Button>
          <Download size={16} />
          Export
        </Button>
      </div>
    </header>
  );
}