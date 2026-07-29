import type { ReactNode } from "react";
import {
    ChevronDown,
} from "lucide-react";

interface SidebarSectionProps {
    title: string;
    count: number;
    icon: ReactNode;
    open: boolean;
    onToggle: () => void;
    children: ReactNode;
}

export function SidebarSection({
    title,
    count,
    icon,
    open,
    onToggle,
    children,
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

                    background: "transparent",
                    border: "none",

                    color: "#FFFFFF",

                    padding: "8px 10px",

                    borderRadius: 10,

                    cursor: "pointer",

                    transition:
                        "background .18s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                        "#1C212B";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                        "transparent";
                }}
            >
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
                            transition:
                                "transform .18s ease",
                            transform: open
                                ? "rotate(0deg)"
                                : "rotate(-90deg)",
                        }}
                    />

                    {icon}

                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform:
                                "uppercase",
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

                        background: "#30363D",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        fontSize: 11,

                        transition:
                            "all .18s ease",
                    }}
                >
                    {count}
                </div>
            </button>

            <div
                style={{
                    overflow: "hidden",

                    maxHeight: open
                        ? 900
                        : 0,

                    opacity: open
                        ? 1
                        : 0,

                    transition:
                        "max-height .22s ease, opacity .18s ease",

                    paddingTop: open
                        ? 10
                        : 0,
                }}
            >
                {children}
            </div>
        </div>
    );
}