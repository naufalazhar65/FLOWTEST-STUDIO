import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

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
                    justifyContent: "space-between",
                    alignItems: "center",

                    background: open ? "#1A1F27" : "transparent",
                    border: "none",

                    color: "#FFFFFF",

                    padding: "8px 10px",

                    borderRadius: 10,

                    cursor: "pointer",

                    position: "relative",

                    transition: "all .18s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1C212B";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = open
                        ? "#1A1F27"
                        : "transparent";
                }}
            >
                {/* Left accent indicator */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 6,
                        bottom: 6,
                        width: 3,
                        borderRadius: 999,
                        background: accent,

                        opacity: open ? 1 : 0,

                        transition: "opacity .18s ease",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <ChevronDown
                        size={16}
                        style={{
                            color: "#8B949E",
                            transform: open
                                ? "rotate(0deg)"
                                : "rotate(-90deg)",
                            transition: "transform .18s ease",
                        }}
                    />

                    <div
                        style={{
                            color: accent,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {icon}
                    </div>

                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                        }}
                    >
                        {title}
                    </span>
                </div>

                <div
                    style={{
                        minWidth: 22,
                        height: 22,

                        borderRadius: 999,

                        background: `${accent}22`,
                        border: `1px solid ${accent}55`,

                        color: accent,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        fontSize: 11,
                        fontWeight: 700,

                        transition: "all .18s ease",
                    }}
                >
                    {count}
                </div>
            </button>

            <div
                style={{
                    overflow: "hidden",

                    maxHeight: open ? 900 : 0,

                    opacity: open ? 1 : 0,

                    transition:
                        "max-height .22s ease, opacity .18s ease",

                    paddingTop: open ? 10 : 0,
                }}
            >
                {children}
            </div>
        </div>
    );
}