import type { ReactNode } from "react";

import {
    ChevronDown,
} from "lucide-react";

import {
    animation,
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

interface SidebarSectionProps {
    title: string;

    count: number;

    icon: ReactNode;

    open: boolean;

    onToggle: () => void;

    children: ReactNode;

    accent: string;
}

export function SidebarSection({
    title,
    count,
    icon,
    open,
    onToggle,
    children,
    accent,
}: SidebarSectionProps) {
    return (
        <section
            style={{
                width: "100%",

                marginBottom:
                    spacing.md,
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                style={{
                    width: "100%",

                    minHeight: 34,

                    display: "flex",

                    alignItems: "center",

                    gap: spacing.sm,

                    padding:
                        `0 ${spacing.sm}px`,

                    margin: 0,

                    border: "none",

                    borderRadius:
                        radius.sm,

                    background:
                        open
                            ? colors.panelHover
                            : "transparent",

                    color:
                        open
                            ? colors.text
                            : colors.textSecondary,

                    cursor: "pointer",

                    textAlign: "left",

                    transition:
                        `background ${animation.fast}, color ${animation.fast}`,

                    userSelect: "none",

                    outline: "none",
                }}
                onMouseEnter={(event) => {
                    event.currentTarget.style
                        .background =
                        colors.panelHover;

                    event.currentTarget.style
                        .color =
                        colors.text;
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style
                        .background =
                        open
                            ? colors.panelHover
                            : "transparent";

                    event.currentTarget.style
                        .color =
                        open
                            ? colors.text
                            : colors.textSecondary;
                }}
            >
                <ChevronDown
                    size={14}
                    strokeWidth={2}
                    style={{
                        flexShrink: 0,

                        color:
                            colors.textMuted,

                        transition:
                            `transform ${animation.fast}`,

                        transform:
                            open
                                ? "rotate(0deg)"
                                : "rotate(-90deg)",
                    }}
                />

                <div
                    style={{
                        width: 26,

                        height: 26,

                        flexShrink: 0,

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "center",

                        borderRadius:
                            radius.sm,

                        background:
                            `${accent}18`,

                        border:
                            `1px solid ${accent}38`,

                        color: accent,
                    }}
                >
                    {icon}
                </div>

                <span
                    style={{
                        flex: 1,

                        minWidth: 0,

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",

                        whiteSpace:
                            "nowrap",

                        fontSize:
                            typography.caption
                                .fontSize,

                        fontWeight:
                            typography.subtitle
                                .fontWeight,

                        letterSpacing:
                            "0.02em",
                    }}
                >
                    {title}
                </span>

                <span
                    style={{
                        minWidth: 20,

                        height: 20,

                        display:
                            "inline-flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        padding:
                            "0 6px",

                        boxSizing:
                            "border-box",

                        borderRadius:
                            radius.full,

                        background:
                            open
                                ? `${accent}18`
                                : colors.panelHover,

                        border:
                            `1px solid ${open
                                ? `${accent}38`
                                : colors.border
                            }`,

                        color:
                            open
                                ? accent
                                : colors.textMuted,

                        fontSize:
                            typography.tiny
                                .fontSize,

                        fontWeight:
                            typography.caption
                                .fontWeight,

                        lineHeight: 1,

                        transition:
                            `background ${animation.fast}, color ${animation.fast}, border-color ${animation.fast}`,
                    }}
                >
                    {count}
                </span>
            </button>

            <div
                style={{
                    display: "grid",

                    gridTemplateRows:
                        open
                            ? "1fr"
                            : "0fr",

                    transition:
                        `grid-template-rows ${animation.normal}`,

                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        minHeight: 0,

                        overflow:
                            "hidden",

                        paddingTop:
                            open
                                ? spacing.xs
                                : 0,

                        transition:
                            `padding-top ${animation.normal}`,
                    }}
                >
                    <div
                        style={{
                            marginLeft:
                                spacing.md,

                            paddingLeft:
                                spacing.sm,

                            borderLeft:
                                `2px solid ${accent}25`,

                            opacity: open
                                ? 1
                                : 0,

                            transition:
                                `opacity ${animation.fast}`,
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}