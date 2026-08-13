import type {
    ReactNode,
} from "react";

import {
    colors,
    spacing,
} from "../../themes";

interface Props {
    children: ReactNode;
}

export function DialogFooter({
    children,
}: Props) {
    return (
        <div
            style={{
                padding:
                    `${spacing.md}px ${spacing.xl}px`,

                display: "flex",

                alignItems:
                    "center",

                justifyContent:
                    "flex-end",

                gap: spacing.sm,

                borderTop:
                    `1px solid ${colors.border}`,

                background:
                    colors.panel,
            }}
        >
            {children}
        </div>
    );
}