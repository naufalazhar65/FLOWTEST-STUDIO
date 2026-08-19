import {
    RefreshCw,
} from "lucide-react";

import { useState } from "react";

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
                background: "#0D1117",
                color: "#F0F6FC",
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
                        "12px 14px",
                    flexShrink: 0,
                    borderBottom:
                        "1px solid #30363D",
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        Element Inspector
                    </div>

                    <div
                        style={{
                            marginTop: 3,
                            color:
                                "#8B949E",
                            fontSize: 11,
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
                        gap: 6,
                        padding:
                            "7px 10px",
                        border:
                            "1px solid #30363D",
                        borderRadius: 6,
                        background:
                            "#161B22",
                        color:
                            "#C9D1D9",
                        cursor: loading
                            ? "default"
                            : "pointer",
                        opacity: loading
                            ? 0.6
                            : 1,
                    }}
                >
                    <RefreshCw
                        size={13}
                        style={{
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
                        margin: 10,
                        padding: 10,
                        border:
                            "1px solid rgba(248,81,73,.3)",
                        borderRadius: 6,
                        background:
                            "rgba(248,81,73,.08)",
                        color:
                            "#F85149",
                        fontSize: 11,
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
                        "1px solid #30363D",
                }}
            >
                <div
                    style={{
                        padding:
                            "10px 12px",
                        color:
                            "#8B949E",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform:
                            "uppercase",
                        letterSpacing:
                            ".04em",
                        borderBottom:
                            "1px solid #21262D",
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
                        borderBottom:
                            "1px solid #30363D",
                        background:
                            "#161B22",
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
                                            "0 4px",
                                        borderRadius:
                                            8,
                                        background:
                                            "rgba(124,92,252,.15)",
                                        color:
                                            "#A78BFA",
                                        fontSize:
                                            9,
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
                    "9px 12px",
                border: "none",
                borderBottom: active
                    ? "2px solid #7C5CFC"
                    : "2px solid transparent",
                background:
                    "transparent",
                color: active
                    ? "#F0F6FC"
                    : "#8B949E",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
            }}
        >
            {children}
        </button>
    );
}