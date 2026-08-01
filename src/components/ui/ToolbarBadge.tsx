import type { ReactNode } from "react";

interface ToolbarBadgeProps {
    icon?: ReactNode;

    children: ReactNode;

    color?: string;

    minWidth?: number;

    pulse?: boolean;
}

export function ToolbarBadge({
    icon,
    children,
    color = "#E6EDF3",
    minWidth,
    pulse = false,
}: ToolbarBadgeProps) {
    return (
        <div
            style={{
                height: 40,

                minWidth,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                gap: 10,

                padding: "0 14px",

                borderRadius: 12,

                background: "#0D1117",

                border: "1px solid #30363D",

                transition: "all .2s ease",

                cursor: "default",

                whiteSpace: "nowrap",

                userSelect: "none",
            }}
        >
            {icon}

            <span
                style={{
                    display: "flex",

                    alignItems: "center",

                    gap: 8,

                    color,

                    fontSize: 13,

                    fontWeight: 600,
                }}
            >
                {children}
            </span>

            {pulse && (
                <div
                    style={{
                        width: 8,

                        height: 8,

                        borderRadius: "50%",

                        background: color,

                        boxShadow: `0 0 8px ${color}`,

                        animation: "pulse 1.2s infinite",
                    }}
                />
            )}
        </div>
    );
}