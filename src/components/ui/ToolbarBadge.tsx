import type { ReactNode } from "react";

interface ToolbarBadgeProps {
    children: ReactNode;

    minWidth?: number;

    borderColor?: string;

    background?: string;
}

export function ToolbarBadge({
    children,
    minWidth = 150,
    borderColor = "#30363D",
    background = "#0D1117",
}: ToolbarBadgeProps) {
    return (
        <div
            style={{
                minWidth,
                height: 38,

                display: "flex",
                alignItems: "center",
                gap: 8,

                padding: "0 14px",

                borderRadius: 999,

                background,

                border: `1px solid ${borderColor}`,
            }}
        >
            {children}
        </div>
    );
}