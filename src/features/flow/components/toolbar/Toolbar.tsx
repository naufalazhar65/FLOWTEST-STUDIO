import type { CSSProperties } from "react";

import {
    Maximize,
    Redo2,
    Undo2,
    Video,
} from "lucide-react";

import {
    animation,
    colors,
    radius,
    spacing,
} from "../../../../themes";

import { useReactFlow } from "reactflow";

import { useFlowStore } from "../../store/useFlowStore";

import {
    useVideoRecordingStore,
} from "../../../execution/store/useVideoRecordingStore";

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

    const recordingEnabled =
        useVideoRecordingStore(
            (state) => state.enabled,
        );

    const toggleRecording =
        useVideoRecordingStore(
            (state) => state.toggle,
        );

    return (
        <>
            <style>
                {`
                    @keyframes flowtest-recording-pulse {
                        0%,
                        100% {
                            opacity: 1;
                            box-shadow:
                                0 0 0 0 rgba(239, 68, 68, 0.35);
                        }

                        50% {
                            opacity: 0.72;
                            box-shadow:
                                0 0 0 5px rgba(239, 68, 68, 0);
                        }
                    }
                `}
            </style>

            <div style={toolbar}>
                {/* History */}
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

                {/* View */}
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

                {/* Screen Recording */}
                <div
                    style={{
                        ...group,
                        marginLeft: "auto",
                    }}
                >
                    <ToolbarButton
                        title={
                            recordingEnabled
                                ? "Disable Screen Recording"
                                : "Enable Screen Recording"
                        }
                        active={
                            recordingEnabled
                        }
                        onClick={
                            toggleRecording
                        }
                    >
                        <Video size={18} />
                    </ToolbarButton>
                </div>
            </div>
        </>
    );
}

interface ToolbarButtonProps {
    title: string;

    disabled?: boolean;

    active?: boolean;

    onClick: () => void;

    children: React.ReactNode;
}

function ToolbarButton({
    title,
    disabled = false,
    active = false,
    onClick,
    children,
}: ToolbarButtonProps) {
    const activeColor =
        colors.danger;

    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            disabled={disabled}
            onClick={onClick}
            style={{
                ...iconButton,

                background:
                    active
                        ? `${activeColor}18`
                        : colors.panel,

                borderColor:
                    active
                        ? activeColor
                        : colors.border,

                color:
                    active
                        ? activeColor
                        : colors.textSecondary,

                opacity:
                    disabled
                        ? 0.45
                        : 1,

                cursor:
                    disabled
                        ? "not-allowed"
                        : "pointer",

                animation:
                    active
                        ? "flowtest-recording-pulse 1.2s ease-in-out infinite"
                        : "none",
            }}
            onMouseEnter={(
                event,
            ) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style
                    .background =
                    active
                        ? `${activeColor}25`
                        : colors.panelHover;

                event.currentTarget.style
                    .borderColor =
                    active
                        ? activeColor
                        : colors.borderLight;

                event.currentTarget.style
                    .color =
                    active
                        ? activeColor
                        : colors.text;

                event.currentTarget.style
                    .transform =
                    "translateY(-1px)";
            }}
            onMouseLeave={(
                event,
            ) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style
                    .background =
                    active
                        ? `${activeColor}18`
                        : colors.panel;

                event.currentTarget.style
                    .borderColor =
                    active
                        ? activeColor
                        : colors.border;

                event.currentTarget.style
                    .color =
                    active
                        ? activeColor
                        : colors.textSecondary;

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