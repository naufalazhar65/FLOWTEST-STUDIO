import { useState } from "react";

import { InspectorPanel } from "../inspector/InspectorPanel";
import { GeneratorPanel } from "../../features/generator/components/GeneratorPanel";

type RightPanelTab =
    | "properties"
    | "generator";

export function RightPanel() {
    const [tab, setTab] =
        useState<RightPanelTab>(
            "properties",
        );

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                background: "#0D1117",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexShrink: 0,
                    borderBottom:
                        "1px solid #30363D",
                    background: "#161B22",
                }}
            >
                <TabButton
                    active={
                        tab ===
                        "properties"
                    }
                    onClick={() =>
                        setTab(
                            "properties",
                        )
                    }
                >
                    Properties
                </TabButton>

                <TabButton
                    active={
                        tab ===
                        "generator"
                    }
                    onClick={() =>
                        setTab(
                            "generator",
                        )
                    }
                >
                    Generator
                </TabButton>
            </div>

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                {tab ===
                "properties" ? (
                    <div
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflow: "auto",
                        }}
                    >
                        <InspectorPanel />
                    </div>
                ) : (
                    <div
                        style={{
                            flex: 1,
                            minHeight: 0,
                            display: "flex",
                            overflow: "hidden",
                        }}
                    >
                        <GeneratorPanel />
                    </div>
                )}
            </div>
        </div>
    );
}

interface TabButtonProps {
    active: boolean;
    children: React.ReactNode;
    onClick(): void;
}

function TabButton({
    active,
    children,
    onClick,
}: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                flex: 1,
                padding: "12px 16px",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                borderBottom: active
                    ? "2px solid #3B82F6"
                    : "2px solid transparent",
                color: active
                    ? "#FFFFFF"
                    : "#8B949E",
                fontWeight: 600,
                transition: "all .2s",
            }}
        >
            {children}
        </button>
    );
}