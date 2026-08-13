import {
  ChevronDown,
  ChevronRight,
  Trash2,
} from "lucide-react";

import {
  colors,
  radius,
  spacing,
  typography,
  animation,
} from "../../themes";

import { useExecutionLogStore } from "../../features/execution/store/useExecutionLogStore";
import { ExecutionTimeline } from "../../features/execution/components/ExecutionTimeline";
import { ExecutionFilter } from "../../features/execution/components/ExecutionFilter";

interface ConsolePanelProps {
  expanded: boolean;
  onToggle: () => void;
}

export function ConsolePanel({
  expanded,
  onToggle,
}: ConsolePanelProps) {
  const clear =
    useExecutionLogStore(
      (state) => state.clear,
    );

  const logs =
    useExecutionLogStore(
      (state) => state.logs,
    );

  return (
    <div
      style={{
        height: "100%",

        display: "flex",

        flexDirection:
          "column",

        background:
          colors.background,

        borderTop:
          `1px solid ${colors.border}`,

        color:
          colors.text,

        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            onToggle();
          }
        }}
        style={{
          minHeight: 48,

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          padding:
            `0 ${spacing.lg}px`,

          borderBottom:
            expanded
              ? `1px solid ${colors.border}`
              : "none",

          background:
            colors.panel,

          cursor:
            "pointer",

          userSelect:
            "none",

          transition:
            `background ${animation.fast}`,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style
            .background =
            colors.panelHover;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style
            .background =
            colors.panel;
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: spacing.sm,
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

              width: 20,

              height: 20,

              flexShrink: 0,

              color:
                colors.textSecondary,
            }}
          >
            {expanded ? (
              <ChevronDown
                size={16}
              />
            ) : (
              <ChevronRight
                size={16}
              />
            )}
          </span>

          <span
            style={{
              color:
                colors.text,

              fontSize:
                typography.subtitle
                  .fontSize,

              fontWeight:
                typography.subtitle
                  .fontWeight,

              lineHeight: 1.3,
            }}
          >
            Execution Console
          </span>

          <span
            style={{
              minHeight: 22,

              display:
                "inline-flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              padding:
                "0 8px",

              borderRadius:
                radius.full,

              background:
                colors.panelHover,

              border:
                `1px solid ${colors.border}`,

              color:
                colors.textSecondary,

              fontSize:
                typography.tiny
                  .fontSize,

              fontWeight:
                typography.caption
                  .fontWeight,

              lineHeight: 1,
            }}
          >
            {logs.length} Logs
          </span>
        </div>

        {expanded && (
          <button
            type="button"
            aria-label="Clear execution logs"
            title="Clear logs"
            onClick={(event) => {
              event.stopPropagation();
              clear();
            }}
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              gap: spacing.xs,

              minHeight: 30,

              padding:
                `0 ${spacing.sm}px`,

              border:
                `1px solid transparent`,

              borderRadius:
                radius.sm,

              background:
                "transparent",

              color:
                colors.textSecondary,

              cursor:
                "pointer",

              fontSize:
                typography.tiny
                  .fontSize,

              fontWeight:
                typography.caption
                  .fontWeight,

              transition:
                `background ${animation.fast}, border-color ${animation.fast}, color ${animation.fast}`,

              outline: "none",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style
                .background =
                colors.panelHover;

              event.currentTarget.style
                .borderColor =
                colors.border;

              event.currentTarget.style
                .color =
                colors.text;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style
                .background =
                "transparent";

              event.currentTarget.style
                .borderColor =
                "transparent";

              event.currentTarget.style
                .color =
                colors.textSecondary;
            }}
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {expanded && (
        <div
          style={{
            flex: 1,

            minHeight: 0,

            overflowY:
              "auto",

            overflowX:
              "hidden",

            padding:
              `${spacing.sm}px ${spacing.lg}px ${spacing.lg}px`,

            boxSizing:
              "border-box",

            overscrollBehavior:
              "contain",
          }}
        >
          <ExecutionFilter />

          <div
            style={{
              marginTop:
                spacing.md,
            }}
          >
            <ExecutionTimeline />
          </div>
        </div>
      )}
    </div>
  );
}