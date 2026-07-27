import type { ReactNode } from "react";
import { Handle, Position } from "reactflow";

import type { ExecutionStatus } from "../../../execution/types/ExecutionStatus";

interface BaseNodeProps {
  title: string;

  subtitle?: string;

  icon: ReactNode;

  color: string;

  children?: ReactNode;

  running?: boolean;

  executionStatus?: ExecutionStatus;

  valid?: boolean;
}

function statusColor(
  status: ExecutionStatus = "idle"
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
  children,
  running = false,
  executionStatus = "idle",
  valid = true,
}: BaseNodeProps) {
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
          border: `2px solid ${
            !valid
              ? "#EF4444"
              : running
                ? "#FBBF24"
                : color
          }`,
          borderRadius: 14,
          overflow: "hidden",
          color: "#FFF",

          boxShadow: !valid
            ? "0 0 18px rgba(239,68,68,.35)"
            : running
              ? "0 0 20px rgba(251,191,36,.5)"
              : "0 8px 30px rgba(0,0,0,.30)",

          transition:
            "transform .2s ease, border .25s ease, box-shadow .25s ease",

          transform: running
            ? "scale(1.02)"
            : "scale(1)",

          animation: running
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
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: !valid
                ? "#EF4444"
                : statusColor(executionStatus),
            }}
          />
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

        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            width: 12,
            height: 12,
            background: color,
          }}
        />
      </div>
    </>
  );
}