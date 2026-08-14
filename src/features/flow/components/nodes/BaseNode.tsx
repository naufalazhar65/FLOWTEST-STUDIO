import type { ReactNode } from "react";
import { Handle, Position } from "reactflow";

import type { NodeExecutionStatus } from "../../../execution/types/NodeExecutionStatus";
import type { NodeHandles } from "../../types/NodePlugin";

interface BaseNodeProps {
  title: string;

  subtitle?: string;

  icon: ReactNode;

  color: string;

  children?: ReactNode;

  executionStatus?: NodeExecutionStatus;

  valid?: boolean;

  breakpoint?: boolean;

  handles?: NodeHandles;

  onToggleBreakpoint?: () => void;
}

function statusColor(
  status: NodeExecutionStatus = "idle"
) {
  switch (status) {
    case "running":
      return "#F59E0B";

    case "passed":
      return "#10B981";

    case "failed":
      return "#EF4444";

    default:
      return "#374151";
  }
}

export function BaseNode({
  title,
  subtitle,
  icon,
  color,
  handles = {
    outputs: ["next"],
  },
  children,
  executionStatus = "idle",
  valid = true,
  breakpoint = false,
  onToggleBreakpoint,
}: BaseNodeProps) {
  const isRunning =
    executionStatus === "running";

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 20px rgba(251,191,36,.35);
            }

            50% {
              box-shadow: 0 0 34px rgba(251,191,36,.75);
            }

            100% {
              box-shadow: 0 0 20px rgba(251,191,36,.35);
            }
          }
        `}
      </style>

      <div
        style={{
          width: 240,
          background: "#1A1F29",
          border: `2px solid ${!valid
            ? "#EF4444"
            : isRunning
              ? "#FBBF24"
              : color
            }`,
          borderRadius: 14,
          overflow: "hidden",
          color: "#FFF",

          boxShadow: !valid
            ? "0 0 18px rgba(239,68,68,.35)"
            : isRunning
              ? "0 0 20px rgba(251,191,36,.5)"
              : "0 8px 30px rgba(0,0,0,.30)",

          transition:
            "transform .2s ease, border .25s ease, box-shadow .25s ease",

          transform: isRunning
            ? "scale(1.02)"
            : "scale(1)",

          animation: isRunning
            ? "pulse 1s infinite"
            : undefined,
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          style={{
            width: 12,
            height: 12,
            background: color,
          }}
        />

        <div
          style={{
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {icon}
            {title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              type="button"
              title={
                breakpoint
                  ? "Remove Breakpoint"
                  : "Add Breakpoint"
              }
              onClick={(event) => {
                event.stopPropagation();
                onToggleBreakpoint?.();
              }}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: breakpoint
                  ? "2px solid #EF4444"
                  : "2px solid rgba(255,255,255,.35)",
                background: breakpoint
                  ? "#EF4444"
                  : "transparent",
                cursor: "pointer",
                padding: 0,
                transition: "all .2s ease",
              }}
            />

            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: !valid
                  ? "#EF4444"
                  : statusColor(executionStatus),
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {subtitle && (
            <div
              style={{
                fontSize: 13,
                color: "#9CA3AF",
              }}
            >
              {subtitle}
            </div>
          )}

          {children}
        </div>

        {handles.outputs.map((output, index) => {
          const isMultiple =
            handles.outputs.length > 1;

          const left =
            isMultiple
              ? `${((index + 1) /
                (handles.outputs.length + 1)) *
              100}%`
              : "50%";

          return (
            <Handle
              key={output}
              id={output}
              type="source"
              position={Position.Bottom}
              style={{
                width: 16,
                height: 16,

                left,

                transform:
                  "translateX(-50%)",

                background: color,

                border:
                  "2px solid #111827",

                zIndex: 10,

                cursor: "crosshair",
              }}
            />
          );
        })}
      </div>
    </>
  );
}