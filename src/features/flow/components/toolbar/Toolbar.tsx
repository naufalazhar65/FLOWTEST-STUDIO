import type { CSSProperties } from "react";

import {
    Maximize,
    Redo2,
    Undo2,
} from "lucide-react";

import {
    animation,
    colors,
    radius,
    spacing,
} from "../../../../themes";

import { useReactFlow } from "reactflow";

import { useFlowStore } from "../../store/useFlowStore";

export function Toolbar() {
    const {
        undo,
        redo,
        history,
        future,
    } = useFlowStore();

    const { fitView } = useReactFlow();

    const canUndo =
        history.length > 0;

    const canRedo =
        future.length > 0;

    return (
        <div style={toolbar}>
            <div style={group}>
                <ToolbarButton
                    title="Undo"
                    disabled={!canUndo}
                    onClick={undo}
                >
                    <Undo2 size={18} />
                </ToolbarButton>

                <ToolbarButton
                    title="Redo"
                    disabled={!canRedo}
                    onClick={redo}
                >
                    <Redo2 size={18} />
                </ToolbarButton>
            </div>

            <div style={divider} />

            <div style={group}>
                <ToolbarButton
                    title="Fit View"
                    onClick={() => {
                        fitView({
                            padding: 0.2,
                            duration: 400,
                        });
                    }}
                >
                    <Maximize size={18} />
                </ToolbarButton>
            </div>
        </div>
    );
}

interface ToolbarButtonProps {
    title: string;

    disabled?: boolean;

    onClick: () => void;

    children: React.ReactNode;
}

function ToolbarButton({
    title,
    disabled = false,
    onClick,
    children,
}: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            disabled={disabled}
            onClick={onClick}
            style={{
                ...iconButton,

                opacity: disabled
                    ? 0.45
                    : 1,

                cursor: disabled
                    ? "not-allowed"
                    : "pointer",
            }}
            onMouseEnter={(event) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style
                    .background =
                    colors.panelHover;

                event.currentTarget.style
                    .borderColor =
                    colors.borderLight;

                event.currentTarget.style
                    .color =
                    colors.text;

                event.currentTarget.style
                    .transform =
                    "translateY(-1px)";
            }}
            onMouseLeave={(event) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style
                    .background =
                    colors.panel;

                event.currentTarget.style
                    .borderColor =
                    colors.border;

                event.currentTarget.style
                    .color =
                    colors.textSecondary;

                event.currentTarget.style
                    .transform =
                    "translateY(0)";
            }}
        >
            {children}
        </button>
    );
}

const toolbar: CSSProperties = {
    height: 54,

    display: "flex",

    alignItems: "center",

    padding:
        `0 ${spacing.lg}px`,

    gap: spacing.md,

    background:
        colors.panel,

    borderBottom:
        `1px solid ${colors.border}`,

    boxSizing: "border-box",

    flexShrink: 0,
};

const group: CSSProperties = {
    display: "flex",

    alignItems: "center",

    gap: spacing.xs,
};

const divider: CSSProperties = {
    width: 1,

    height: 24,

    background:
        colors.border,

    flexShrink: 0,
};

const iconButton: CSSProperties = {
    width: 36,

    height: 36,

    display: "flex",

    alignItems: "center",

    justifyContent:
        "center",

    flexShrink: 0,

    borderRadius:
        radius.md,

    border:
        `1px solid ${colors.border}`,

    background:
        colors.panel,

    color:
        colors.textSecondary,

    outline: "none",

    transition:
        `background ${animation.fast}, border-color ${animation.fast}, color ${animation.fast}, transform ${animation.fast}`,
};