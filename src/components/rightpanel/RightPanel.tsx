import { useState } from "react";

import {
    Sparkles,
} from "lucide-react";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

import {
    InspectorPanel,
} from "../inspector/InspectorPanel";

import {
    GeneratorPanel,
} from "../../features/generator/components/GeneratorPanel";

import {
    ElementInspector,
} from "../../features/inspector/components/ElementInspector";

import {
    AIAssistant,
} from "../../features/ai/components/AIAssistant";

type RightPanelTab =
    | "properties"
    | "element"
    | "generator"
    | "ai";

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
                flexDirection:
                    "column",
                minHeight: 0,
                background:
                    colors.background,
            }}
        >
            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    flexShrink: 0,
                    gap: spacing.xs,
                    padding:
                        `${spacing.xs}px ${spacing.xs}px 0`,
                    borderBottom:
                        `1px solid ${colors.border}`,
                    background:
                        colors.panel,
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
                        tab === "element"
                    }
                    onClick={() =>
                        setTab(
                            "element",
                        )
                    }
                >
                    Element
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

                <TabButton
                    active={
                        tab === "ai"
                    }
                    onClick={() =>
                        setTab("ai")
                    }
                >
                    <span
                        style={{
                            display:
                                "inline-flex",
                            alignItems:
                                "center",
                            gap: 5,
                        }}
                    >
                        <Sparkles
                            size={13}
                        />

                        AI
                    </span>
                </TabButton>
            </div>

            {/* Panel */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    minHeight: 0,
                    overflow:
                        "hidden",
                }}
            >
                {tab ===
                    "properties" && (
                    <div
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflow:
                                "auto",
                        }}
                    >
                        <InspectorPanel />
                    </div>
                )}

                {tab === "element" && (
                    <div
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflow:
                                "hidden",
                        }}
                    >
                        <ElementInspector />
                    </div>
                )}

                {tab ===
                    "generator" && (
                    <div
                        style={{
                            flex: 1,
                            minHeight: 0,
                            display:
                                "flex",
                            overflow:
                                "hidden",
                        }}
                    >
                        <GeneratorPanel />
                    </div>
                )}

                {tab === "ai" && (
                    <div
                        style={{
                            flex: 1,
                            minHeight: 0,
                            overflow:
                                "hidden",
                        }}
                    >
                        <AIAssistant />
                    </div>
                )}
            </div>
        </div>
    );
}

interface TabButtonProps {
    active: boolean;

    children:
        | React.ReactNode;

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
                minWidth: 0,
                padding:
                    `${spacing.sm}px ${spacing.xs}px`,
                cursor: "pointer",
                border: "none",
                borderBottom:
                    active
                        ? `2px solid ${colors.accent}`
                        : "2px solid transparent",
                borderTopLeftRadius:
                    radius.sm,
                borderTopRightRadius:
                    radius.sm,
                background:
                    active
                        ? colors.background
                        : "transparent",
                color: active
                    ? colors.text
                    : colors.textSecondary,
                fontWeight: 600,
                fontSize:
                    typography.tiny
                        .fontSize,
                transition:
                    "all .18s",
            }}
        >
            {children}
        </button>
    );
}