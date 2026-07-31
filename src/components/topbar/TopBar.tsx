import { useCallback } from "react";
import {
  FolderOpen,
  Save,
  Play,
  Pause,
  Square,
  Smartphone,
  Cpu,
} from "lucide-react";

import { Button } from "../ui/Button";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { ExecutionController } from "../../features/execution/services/ExecutionController";
import { useExecutionStore } from "../../features/execution/store/useExecutionStore";
import { exportProject } from "../../features/flow/services/exportService";
import { openJsonFile } from "../../features/flow/services/filePicker";
import { importProject } from "../../features/flow/services/importService";
import { getFlowPlatform } from "../../features/flow/services/getFlowPlatform";

export function TopBar() {
  const { nodes, edges, saveProject,
    loadProject, } = useFlowStore();

  const platform = getFlowPlatform(nodes);

  const status = useExecutionStore(
    (state) => state.status
  );
  console.log("TopBar status:", status);

  const progress = useExecutionStore(
    (state) => state.progress
  );

  const executedNodes = useExecutionStore(
    (state) => state.executedNodes
  );

  const totalNodes = useExecutionStore(
    (state) => state.totalNodes
  );


  const handleRun = useCallback(async () => {
    try {
      await ExecutionController.run(nodes, {
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

          {platform === "Android"
            ? "Android"
            : platform === "iOS"
              ? "iOS"
              : "No Platform"}
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
        {status !== "idle" && (
          <div
            style={{
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#8B949E",
              }}
            >
              <span>
                {executedNodes} / {totalNodes} Nodes
              </span>

              <span>{progress}%</span>
            </div>

            <div
              style={{
                height: 8,
                background: "#30363D",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background:
                    status === "failed"
                      ? "#EF4444"
                      : "#22C55E",
                  transition: "width .3s ease",
                }}
              />
            </div>
          </div>
        )}
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

        {status === "idle" && (
          <Button onClick={handleRun}>
            <Play size={16} />
            Run
          </Button>
        )}

        {status === "running" && (
          <>
            <Button
              onClick={() => ExecutionController.pause()}
            >
              <Pause size={16} />
              Pause
            </Button>

            <Button
              onClick={() => ExecutionController.stop()}
            >
              <Square size={16} />
              Stop
            </Button>
          </>
        )}

        {status === "paused" && (
          <>
            <Button
              onClick={() => ExecutionController.resume()}
            >
              <Play size={16} />
              Resume
            </Button>

            <Button
              onClick={() => ExecutionController.stop()}
            >
              <Square size={16} />
              Stop
            </Button>
          </>
        )}
        {(status === "passed" ||
          status === "failed" ||
          status === "stopped") && (
            <Button onClick={handleRun}>
              <Play size={16} />
              Run Again
            </Button>
          )}


      </div>
    </header>
  );
}