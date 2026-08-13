import { useState } from "react";

import {
    animation,
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

import { InspectorPanel } from "../inspector/InspectorPanel";
import { GeneratorPanel } from "../../features/generator/components/GeneratorPanel";
import { ElementInspector } from "../../features/inspector/components/ElementInspector";

type RightPanelTab =
    | "properties"
    | "element"
    | "generator";

export function RightPanel() {
    const [tab, setTab] =
        useState<RightPanelTab>(
            "properties",
        );

    return (
        <aside
            style={{
                height: "100%",

                display: "flex",

                flexDirection:
                    "column",

                minHeight: 0,

                background:
                    colors.background,

                borderLeft:
                    `1px solid ${colors.border}`,
            }}
        >
            {/* Tabs */}
            <div
                role="tablist"
                aria-label="Inspector panels"
                style={{
                    display: "flex",

                    flexShrink: 0,

                    padding:
                        `${spacing.xs}px ${spacing.sm}px 0`,

                    gap: spacing.xs,

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
            </div>

            {/* Panel */}
            <div
                style={{
                    flex: 1,

                    display: "flex",

                    minHeight: 0,

                    overflow: "hidden",
                }}
            >
                {tab ===
                    "properties" && (
                    <div
                        style={{
                            flex: 1,

                            minHeight: 0,

                            overflowY: "auto",

                            overscrollBehavior:
                                "contain",
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

                            overflow: "hidden",
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

                            display: "flex",

                            overflow:
                                "hidden",
                        }}
                    >
                        <GeneratorPanel />
                    </div>
                )}
            </div>
        </aside>
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
            role="tab"
            aria-selected={active}
            onClick={onClick}
            style={{
                position: "relative",

                flex: 1,

                minWidth: 0,

                padding:
                    `${spacing.sm}px ${spacing.sm}px`,

                border: "none",

                borderRadius:
                    `${radius.sm}px ${radius.sm}px 0 0`,

                background:
                    active
                        ? colors.panelHover
                        : "transparent",

                color:
                    active
                        ? colors.text
                        : colors.textSecondary,

                fontSize:
                    typography.caption
                        .fontSize,

                fontWeight:
                    active
                        ? typography.subtitle
                              .fontWeight
                        : typography.caption
                              .fontWeight,

                cursor: "pointer",

                transition:
                    `background ${animation.fast}, color ${animation.fast}`,

                outline: "none",

                whiteSpace:
                    "nowrap",
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
            }}
        >
            {children}

            {active && (
                <span
                    aria-hidden="true"
                    style={{
                        position:
                            "absolute",

                        left:
                            spacing.sm,

                        right:
                            spacing.sm,

                        bottom: 0,

                        height: 2,

                        borderRadius:
                            radius.full,

                        background:
                            colors.accent,
                    }}
                />
            )}
        </button>
    );
}