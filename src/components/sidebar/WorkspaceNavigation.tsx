import {
    BarChart3,
    Layers3,
    Workflow,
    Smartphone,
} from "lucide-react";

import { useWorkspaceStore } from "../../features/workspace/store/useWorkspaceStore";

export function WorkspaceNavigation() {
    const view = useWorkspaceStore(
        (state) => state.view,
    );

    const setView = useWorkspaceStore(
        (state) => state.setView,
    );

    return (
        <div
            style={{
                padding: "14px 16px",

                borderBottom:
                    "1px solid #30363D",
            }}
        >
            <div
                style={{
                    marginBottom: 8,

                    color: "#8B949E",

                    fontSize: 10,

                    fontWeight: 700,

                    letterSpacing: 1,

                    textTransform:
                        "uppercase",
                }}
            >
                Workspace
            </div>

            <NavigationButton
                icon={
                    <Workflow size={16} />
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
                    <Layers3 size={16} />
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
                    <BarChart3 size={16} />
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
        </div>
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
            style={{
                width: "100%",

                display: "flex",

                alignItems: "center",

                gap: 10,

                padding: "9px 10px",

                marginBottom: 4,

                border:
                    "1px solid transparent",

                borderRadius: 8,

                background: active
                    ? "#21262D"
                    : "transparent",

                color: active
                    ? "#E6EDF3"
                    : "#8B949E",

                cursor: "pointer",

                fontSize: 13,

                fontWeight: active
                    ? 600
                    : 500,

                textAlign: "left",

                transition:
                    "all .15s ease",
            }}
            onMouseEnter={(
                event,
            ) => {
                if (active) return;

                event.currentTarget.style.background =
                    "#161B22";

                event.currentTarget.style.color =
                    "#E6EDF3";
            }}
            onMouseLeave={(
                event,
            ) => {
                if (active) return;

                event.currentTarget.style.background =
                    "transparent";

                event.currentTarget.style.color =
                    "#8B949E";
            }}
        >
            {icon}

            <span>{label}</span>
        </button>
    );
}