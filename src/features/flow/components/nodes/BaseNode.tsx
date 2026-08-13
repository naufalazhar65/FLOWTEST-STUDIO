import type { ReactNode } from "react";
import {
  Handle,
  Position,
} from "reactflow";

import {
  animation,
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from "../../../../themes";

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
  status: NodeExecutionStatus = "idle",
) {
  switch (status) {
    case "running":
      return colors.warning;

    case "passed":
      return colors.success;

    case "failed":
      return colors.danger;

    default:
      return colors.textMuted;
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

  const currentStatusColor =
    !valid
      ? colors.danger
      : statusColor(
        executionStatus,
      );

  const nodeBorderColor =
    !valid
      ? colors.danger
      : isRunning
        ? colors.warning
        : color;

  const nodeShadow =
    !valid
      ? `0 0 18px ${colors.danger}35`
      : isRunning
        ? `0 0 22px ${colors.warning}38`
        : shadow.card;

  return (
    <>
      <style>
        {`
                    @keyframes flow-node-pulse {
                        0% {
                            box-shadow:
                                0 0 18px ${colors.warning}26;
                        }

                        50% {
                            box-shadow:
                                0 0 26px ${colors.warning}4D;
                        }

                        100% {
                            box-shadow:
                                0 0 18px ${colors.warning}26;
                        }
                    }
                `}
      </style>

      <div
        style={{
          width: 240,

          background:
            colors.panel,

          border:
            `1px solid ${nodeBorderColor}`,

          borderRadius:
            radius.lg,

          overflow: "hidden",

          color:
            colors.text,

          boxShadow:
            nodeShadow,

          transition:
            `transform ${animation.normal}, border-color ${animation.normal}, box-shadow ${animation.normal}`,

          transform:
            isRunning
              ? "scale(1.015)"
              : "scale(1)",

          animation:
            isRunning
              ? "flow-node-pulse 1.2s ease-in-out infinite"
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

            border:
              `2px solid ${colors.panel}`,

            boxSizing:
              "border-box",
          }}
        />

        {/* Node Header */}
        <div
          style={{
            background:
              color,

            minHeight: 46,

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: spacing.sm,

            padding:
              `${spacing.sm}px ${spacing.md}px`,

            boxSizing:
              "border-box",
          }}
        >
          <div
            style={{
              minWidth: 0,

              display: "flex",

              alignItems:
                "center",

              gap: spacing.sm,

              fontSize:
                typography.body
                  .fontSize,

              fontWeight:
                typography.subtitle
                  .fontWeight,

              color:
                colors.text,

              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexShrink: 0,

                color:
                  colors.text,
              }}
            >
              {icon}
            </span>

            <span
              style={{
                minWidth: 0,

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",
              }}
            >
              {title}
            </span>
          </div>

          <div
            style={{
              display: "flex",

              alignItems:
                "center",

              gap: spacing.sm,

              flexShrink: 0,
            }}
          >
            <button
              type="button"
              title={
                breakpoint
                  ? "Remove Breakpoint"
                  : "Add Breakpoint"
              }
              aria-label={
                breakpoint
                  ? "Remove breakpoint"
                  : "Add breakpoint"
              }
              onClick={(
                event,
              ) => {
                event.stopPropagation();

                onToggleBreakpoint?.();
              }}
              style={{
                width: 14,

                height: 14,

                padding: 0,

                borderRadius:
                  radius.full,

                border:
                  breakpoint
                    ? `2px solid ${colors.danger}`
                    : `2px solid rgba(255,255,255,.45)`,

                background:
                  breakpoint
                    ? colors.danger
                    : "transparent",

                cursor:
                  onToggleBreakpoint
                    ? "pointer"
                    : "default",

                transition:
                  `background ${animation.fast}, border-color ${animation.fast}, transform ${animation.fast}`,

                transform:
                  breakpoint
                    ? "scale(1.05)"
                    : "scale(1)",

                flexShrink: 0,
              }}
              onMouseEnter={(
                event,
              ) => {
                if (
                  !onToggleBreakpoint
                ) {
                  return;
                }

                event.currentTarget.style
                  .transform =
                  "scale(1.12)";
              }}
              onMouseLeave={(
                event,
              ) => {
                event.currentTarget.style
                  .transform =
                  breakpoint
                    ? "scale(1.05)"
                    : "scale(1)";
              }}
            />

            <div
              title={
                !valid
                  ? "Validation failed"
                  : `Status: ${executionStatus}`
              }
              style={{
                width: 9,

                height: 9,

                flexShrink: 0,

                borderRadius:
                  radius.full,

                background:
                  currentStatusColor,

                boxShadow:
                  `0 0 8px ${currentStatusColor}66`,
              }}
            />
          </div>
        </div>

        {/* Node Body */}
        <div
          style={{
            padding:
              spacing.md,

            display: "flex",

            flexDirection:
              "column",

            gap: spacing.sm,

            background:
              colors.panel,
          }}
        >
          {subtitle && (
            <div
              style={{
                color:
                  colors.textSecondary,

                fontSize:
                  typography.caption
                    .fontSize,

                fontWeight:
                  typography.caption
                    .fontWeight,

                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          )}

          {children}
        </div>

        {handles.outputs.map(
          (
            output,
            index,
          ) => (
            <Handle
              key={output}
              id={output}
              type="source"
              position={
                Position.Bottom
              }
              style={{
                width: 12,

                height: 12,

                background:
                  color,

                border:
                  `2px solid ${colors.panel}`,

                boxSizing:
                  "border-box",

                left:
                  handles
                    .outputs
                    .length ===
                    1
                    ? "50%"
                    : `${((index +
                      1) /
                      (handles
                        .outputs
                        .length +
                        1)) *
                    100
                    }%`,
              }}
            />
          ),
        )}
      </div>
    </>
  );
}