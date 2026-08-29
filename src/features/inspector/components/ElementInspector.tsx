import { useState } from "react";

import {
    RefreshCw,
} from "lucide-react";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../../themes";

import { ElementProperties } from "./ElementProperties";
import { ElementHighlight } from "./ElementHighlight";
import { ElementTree } from "./ElementTree";
import { LocatorList } from "./LocatorList";

import { useInspectorStore } from "../store/useInspectorStore";

import { generateLocators } from "../services/generateLocators";
import { refreshInspector } from "../services/refreshInspector";

type InspectorTab =
    | "properties"
    | "locators";

export function ElementInspector() {
    const [tab, setTab] =
        useState<InspectorTab>(
            "properties",
        );

    const elements =
        useInspectorStore(
            (state) =>
                state.elements,
        );

    const selectedElement =
        useInspectorStore(
            (state) =>
                state.selectedElement,
        );

    const loading =
        useInspectorStore(
            (state) =>
                state.loading,
        );

    const error =
        useInspectorStore(
            (state) =>
                state.error,
        );

    const locators =
        selectedElement

            ? generateLocators(
                selectedElement,
            )
            : [];

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
                color: colors.text,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "space-between",
                    padding:
                        `${spacing.lg}px ${spacing.lg}px`,
                    flexShrink: 0,
                    borderBottom:
                        `1px solid ${colors.border}`,
                    background:
                        colors.panel,
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize:
                                typography.subtitle
                                    .fontSize,
                            fontWeight:
                                typography.subtitle
                                    .fontWeight,
                            letterSpacing: 0.2,
                        }}
                    >
                        Element Inspector
                    </div>

                    <div
                        style={{
                            marginTop:
                                spacing.xs,
                            color:
                                colors.textSecondary,
                            fontSize:
                                typography.tiny
                                    .fontSize,
                        }}
                    >
                        Inspect elements
                        from Appium
                    </div>
                </div>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                        void refreshInspector();
                    }}
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: spacing.sm - 2,
                        padding:
                            `${spacing.sm - 1}px ${spacing.md}px`,
                        border:
                            `1px solid ${colors.borderLight}`,
                        borderRadius:
                            radius.sm,
                        background:
                            colors.background,
                        color:
                            colors.text,
                        cursor: loading
                            ? "default"
                            : "pointer",
                        opacity: loading
                            ? 0.6
                            : 1,
                        fontSize:
                            typography.tiny
                                .fontSize,
                        fontWeight: 500,
                        transition:
                            "all .18s",
                    }}
                >
                    <RefreshCw
                        size={13}
                        style={{
                            color:
                                colors
                                    .textSecondary,
                            animation:
                                loading
                                    ? "spin 1s linear infinite"
                                    : undefined,
                        }}
                    />

                    {loading
                        ? "Loading..."
                        : "Refresh"}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div
                    style={{
                        margin:
                            spacing.md,
                        padding:
                            spacing.md,
                        border:
                            `1px solid ${colors.danger}59`,
                        borderRadius:
                            radius.sm,
                        background:
                            `${colors.danger}14`,
                        color:
                            colors.danger,
                        fontSize:
                            typography.tiny
                                .fontSize,
                        lineHeight: 1.5,
                    }}
                >
                    {error}
                </div>
            )}

            {/* Element Tree */}
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    borderBottom:
                        `1px solid ${colors.border}`,
                }}
            >
                <div
                    style={{
                        padding:
                            `${spacing.sm + 2}px ${spacing.md}px`,
                        color:
                            colors.textSecondary,
                        fontSize:
                            typography.tiny
                                .fontSize,
                        fontWeight: 600,
                        textTransform:
                            "uppercase",
                        letterSpacing:
                            "0.06em",
                        borderBottom:
                            `1px solid ${colors.border}`,
                        background:
                            colors
                                .background,
                    }}
                >
                    Element Tree
                </div>

                <ElementTree
                    elements={
                        elements
                    }
                />
            </div>

            {/* Detail Tabs */}
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection:
                        "column",
                }}
            >
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
                    <InspectorTabButton
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
                    </InspectorTabButton>

                    <InspectorTabButton
                        active={
                            tab ===
                            "locators"
                        }
                        onClick={() =>
                            setTab(
                                "locators",
                            )
                        }
                    >
                        Locators

                        {locators.length >
                            0 && (
                                <span
                                    style={{
                                        marginLeft:
                                            6,
                                        minWidth:
                                            16,
                                        height: 16,
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        padding:
                                            "0 6px",
                                        borderRadius:
                                            8,
                                        background:
                                            `${colors.accent}29`,
                                        color:
                                            colors
                                                .accentHover,
                                        fontSize:
                                            9,
                                        fontWeight:
                                            600,
                                    }}
                                >
                                    {
                                        locators.length
                                    }
                                </span>
                            )}
                    </InspectorTabButton>
                </div>

                <div
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflowY:
                            "auto",
                    }}
                >
                    {tab ===
                        "properties" ? (
                        <ElementProperties />
                    ) : (
                        <div
                            style={{
                                padding: 12,
                            }}
                        >
                            <LocatorList
                                locators={
                                    locators
                                }
                            />

                            <ElementHighlight
                                element={selectedElement}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface InspectorTabButtonProps {
    active: boolean;
    children: React.ReactNode;
    onClick(): void;
}

function InspectorTabButton({
    active,
    children,
    onClick,
}: InspectorTabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                flex: 1,
                display: "flex",
                alignItems:
                    "center",
                justifyContent:
                    "center",
                padding:
                    `${spacing.sm}px ${spacing.xs}px`,
                border: "none",
                borderBottom: active
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
                cursor: "pointer",
                fontSize:
                    typography.tiny
                        .fontSize,
                fontWeight: 600,
                transition:
                    "all .18s",
            }}
        >
            {children}
        </button>
    );
}