import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import type { ElementInfo } from "../types/ElementInfo";

import { useInspectorStore } from "../store/useInspectorStore";

interface Props {
    elements: ElementInfo[];
}

export function ElementTree({
    elements,
}: Props) {
    if (elements.length === 0) {
        return (
            <div
                style={{
                    padding: 20,
                    color: "#8B949E",
                    fontSize: 13,
                }}
            >
                No elements found.
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
            }}
        >
            {elements.map(
                (element) => (
                    <ElementTreeNode
                        key={element.id}
                        element={element}
                        depth={0}
                    />
                ),
            )}
        </div>
    );
}

interface ElementTreeNodeProps {
    element: ElementInfo;
    depth: number;
}

function ElementTreeNode({
    element,
    depth,
}: ElementTreeNodeProps) {
    const selectedElement =
        useInspectorStore(
            (state) =>
                state.selectedElement,
        );

    const selectElement =
        useInspectorStore(
            (state) =>
                state.selectElement,
        );

    const hasChildren =
        element.children.length > 0;

    const [expanded, setExpanded] =
        useState(depth < 2);

    const selected =
        selectedElement?.id ===
        element.id;

    const displayName =
        getElementDisplayName(
            element,
        );

    function toggleExpanded(
        event: React.MouseEvent,
    ) {
        event.stopPropagation();

        setExpanded(
            (value) => !value,
        );
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 32,
                    paddingRight: 8,
                    background:
                        selected
                            ? "rgba(124, 92, 252, 0.15)"
                            : "transparent",
                }}
            >
                {/* Expand / Collapse */}
                <button
                    type="button"
                    disabled={!hasChildren}
                    onClick={toggleExpanded}
                    aria-label={
                        hasChildren
                            ? expanded
                                ? "Collapse element"
                                : "Expand element"
                            : undefined
                    }
                    style={{
                        width: 24,
                        height: 28,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        padding: 0,
                        marginLeft: depth * 12,
                        border: "none",
                        background: "transparent",
                        color: hasChildren
                            ? "#8B949E"
                            : "transparent",
                        cursor: hasChildren
                            ? "pointer"
                            : "default",
                    }}
                >
                    {hasChildren &&
                        (expanded ? (
                            <ChevronDown
                                size={14}
                            />
                        ) : (
                            <ChevronRight
                                size={14}
                            />
                        ))}
                </button>

                {/* Element */}
                <button
                    type="button"
                    onClick={() =>
                        selectElement(
                            element,
                        )
                    }
                    style={{
                        flex: 1,
                        minWidth: 0,
                        height: 32,
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 7,
                        padding:
                            "0 6px",
                        border: "none",
                        background:
                            "transparent",
                        color: selected
                            ? "#F0F6FC"
                            : "#C9D1D9",
                        cursor:
                            "pointer",
                        textAlign:
                            "left",
                        fontSize: 12,
                    }}
                >
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            flexShrink: 0,
                            border:
                                "1px solid #6E7681",
                            borderRadius:
                                "50%",
                            background:
                                selected
                                    ? "#7C5CFC"
                                    : "transparent",
                        }}
                    />

                    <span
                        style={{
                            flexShrink: 0,
                            minWidth: 68,
                            color:
                                selected
                                    ? "#A78BFA"
                                    : "#7C5CFC",
                            fontFamily:
                                "monospace",
                            fontSize: 11,
                        }}
                    >
                        {getShortElementType(
                            element.tagName,
                        )}
                    </span>

                    {displayName !==
                        element.tagName && (
                            <span
                                style={{
                                    minWidth: 0,
                                    flex: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    color:
                                        selected
                                            ? "#F0F6FC"
                                            : "#C9D1D9",
                                    fontSize: 12,
                                    fontWeight:
                                        displayName !==
                                            element.tagName
                                            ? 500
                                            : 400,
                                }}
                            >
                                {displayName}
                            </span>
                        )}
                </button>
            </div>

            {/* Children */}
            {hasChildren &&
                expanded && (
                    <div>
                        {element.children.map(
                            (child) => (
                                <ElementTreeNode
                                    key={
                                        child.id
                                    }
                                    element={
                                        child
                                    }
                                    depth={
                                        depth +
                                        1
                                    }
                                />
                            ),
                        )}
                    </div>
                )}
        </div>
    );
}

function getShortElementType(
    tagName: string,
): string {
    const prefix =
        "XCUIElementType";

    if (
        tagName.startsWith(prefix)
    ) {
        return tagName.slice(
            prefix.length,
        );
    }

    return tagName;
}

function getElementDisplayName(
    element: ElementInfo,
): string {
    return (
        element.text ||
        element.contentDescription ||
        element.label ||
        element.name ||
        element.resourceId ||
        element.className ||
        element.tagName
    );
}