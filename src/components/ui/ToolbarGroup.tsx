import type { ReactNode } from "react";

interface ToolbarGroupProps {
    children: ReactNode;
}

export function ToolbarGroup({
    children,
}: ToolbarGroupProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}
        >
            {children}
        </div>
    );
}