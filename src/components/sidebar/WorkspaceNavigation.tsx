import {
    BarChart3,
    Layers3,
    Smartphone,
    Workflow,
} from "lucide-react";

import {
    animation,
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

import { useWorkspaceStore } from "../../features/workspace/store/useWorkspaceStore";

export function WorkspaceNavigation() {
    const view = useWorkspaceStore(
        (state) => state.view,
    );

    const setView = useWorkspaceStore(
        (state) => state.setView,
    );

    return (
        <nav
            aria-label="Workspace navigation"
            style={{
                padding:
                    `${spacing.sm + 2}px ${spacing.md}px`,

                borderBottom:
                    `1px solid ${colors.border}`,
            }}
        >
            <div
                style={{
                    marginBottom:
                        spacing.xs + 2,

                    paddingLeft:
                        spacing.xs,

                    color:
                        colors.textMuted,

                    fontSize:
                        typography.tiny
                            .fontSize,

                    fontWeight:
                        typography.caption
                            .fontWeight,

                    letterSpacing:
                        "0.08em",

                    textTransform:
                        "uppercase",
                }}
            >
                Workspace
            </div>

            <NavigationButton
                icon={
                    <Workflow
                        size={16}
                    />
                }
                label="Flow Builder"
                active={
                    view === "flow"
                }
                onClick={() =>
                    setView("flow")
                }
            />

            <NavigationButton
                icon={
                    <Layers3
                        size={16}
                    />
                }
                label="Test Suites"
                active={
                    view === "suites"
                }
                onClick={() =>
                    setView("suites")
                }
            />

            <NavigationButton
                icon={
                    <BarChart3
                        size={16}
                    />
                }
                label="Reports"
                active={
                    view === "reports"
                }
                onClick={() =>
                    setView("reports")
                }
            />

            <NavigationButton
                icon={
                    <Smartphone
                        size={16}
                    />
                }
                label="Devices"
                active={
                    view === "devices"
                }
                onClick={() =>
                    setView("devices")
                }
            />
        </nav>
    );
}

interface NavigationButtonProps {
    icon: React.ReactNode;

    label: string;

    active: boolean;

    onClick: () => void;
}

function NavigationButton({
    icon,
    label,
    active,
    onClick,
}: NavigationButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={
                active
                    ? "page"
                    : undefined
            }
            style={{
                position: "relative",

                width: "100%",

                display: "flex",

                alignItems: "center",

                gap: spacing.sm,

                padding:
                    `${spacing.sm}px ${spacing.sm + 2}px`,

                marginBottom:
                    spacing.xs,

                border:
                    `1px solid ${
                        active
                            ? colors.borderLight
                            : "transparent"
                    }`,

                borderRadius:
                    radius.sm,

                background:
                    active
                        ? colors.panelHover
                        : "transparent",

                color:
                    active
                        ? colors.text
                        : colors.textSecondary,

                cursor: "pointer",

                fontSize:
                    typography.body
                        .fontSize,

                fontWeight:
                    active
                        ? typography.subtitle
                              .fontWeight
                        : typography.body
                              .fontWeight,

                lineHeight: 1.3,

                textAlign: "left",

                transition:
                    `background ${animation.fast}, border-color ${animation.fast}, color ${animation.fast}, transform ${animation.fast}`,

                outline: "none",

                boxSizing:
                    "border-box",
            }}
            onMouseEnter={(event) => {
                if (active) {
                    return;
                }

                event.currentTarget.style
                    .background =
                    colors.panelHover;

                event.currentTarget.style
                    .color =
                    colors.text;

                event.currentTarget.style
                    .transform =
                    "translateX(1px)";
            }}
            onMouseLeave={(event) => {
                if (active) {
                    return;
                }

                event.currentTarget.style
                    .background =
                    "transparent";

                event.currentTarget.style
                    .color =
                    colors.textSecondary;

                event.currentTarget.style
                    .transform =
                    "translateX(0)";
            }}
        >
            {active && (
                <span
                    aria-hidden="true"
                    style={{
                        position:
                            "absolute",

                        left: -1,

                        top: "50%",

                        width: 3,

                        height: 18,

                        transform:
                            "translateY(-50%)",

                        borderRadius:
                            radius.full,

                        background:
                            colors.accent,
                    }}
                />
            )}

            <span
                style={{
                    width: 18,

                    height: 18,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    flexShrink: 0,

                    color:
                        active
                            ? colors.accentHover
                            : colors.textMuted,

                    transition:
                        `color ${animation.fast}`,
                }}
            >
                {icon}
            </span>

            <span
                style={{
                    minWidth: 0,

                    flex: 1,

                    overflow: "hidden",

                    textOverflow:
                        "ellipsis",

                    whiteSpace:
                        "nowrap",
                }}
            >
                {label}
            </span>
        </button>
    );
}