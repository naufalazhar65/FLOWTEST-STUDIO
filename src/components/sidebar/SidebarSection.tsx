import type { ReactNode } from "react";

import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

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
        <div
            style={{
                marginBottom: 18,
            }}
        >
            <button
                onClick={onToggle}
                style={{
                    width: "100%",

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                        "space-between",

                    padding: "10px 12px",

                    borderRadius: 12,

                    border: open
                        ? `1px solid ${accent}55`
                        : "1px solid #30363D",

                    background: open
                        ? "#1A1F27"
                        : "#161B22",

                    cursor: "pointer",

                    color: "#FFFFFF",

                    transition:
                        "all .18s ease",

                    userSelect: "none",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                        "#1C212B";

                    e.currentTarget.style.borderColor =
                        open
                            ? `${accent}99`
                            : "#404854";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                        open
                            ? "#1A1F27"
                            : "#161B22";

                    e.currentTarget.style.borderColor =
                        open
                            ? `${accent}55`
                            : "#30363D";
                }}
            >
                <div
                    style={{
                        display: "flex",

                        alignItems: "center",

                        gap: 10,
                    }}
                >
                    {open ? (
                        <ChevronDown
                            size={16}
                            color="#8B949E"
                        />
                    ) : (
                        <ChevronRight
                            size={16}
                            color="#8B949E"
                        />
                    )}

                    <div
                        style={{
                            width: 28,

                            height: 28,

                            borderRadius: 8,

                            background: `${accent}22`,

                            color: accent,

                            display: "flex",

                            alignItems: "center",

                            justifyContent:
                                "center",

                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </div>

                    <span
                        style={{
                            fontSize: 13,

                            fontWeight: 700,

                            letterSpacing: .3,
                        }}
                    >
                        {title}
                    </span>
                </div>

                <div
                    style={{
                        minWidth: 24,

                        height: 24,

                        borderRadius: 999,

                        background: `${accent}22`,

                        border: `1px solid ${accent}55`,

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                            "center",

                        color: accent,

                        fontSize: 11,

                        fontWeight: 700,
                    }}
                >
                    {count}
                </div>
            </button>

            {/* Animated Content */}
            <div
                style={{
                    display: "grid",

                    gridTemplateRows: open
                        ? "1fr"
                        : "0fr",

                    transition:
                        "grid-template-rows .25s ease",

                    marginLeft: 14,
                }}
            >
                <div
                    style={{
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            paddingTop: 12,

                            paddingLeft: 16,

                            borderLeft:
                                `2px solid ${accent}33`,

                            opacity: open
                                ? 1
                                : 0,

                            transition:
                                "opacity .18s ease",
                        }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}