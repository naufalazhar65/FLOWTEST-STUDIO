import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    colors,
    radius,
} from "../../themes";

interface Props {
    children: ReactNode;

    color?: string;

    style?: CSSProperties;
}

export function Badge({
    children,
    color = colors.textSecondary,
    style,
}: Props) {
    return (
        <span
            style={{
                display: "inline-flex",

                alignItems: "center",

                gap: 6,

                padding: "4px 10px",

                borderRadius:
                    radius.full,

                background:
                    colors.panelHover,

                border:
                    `1px solid ${colors.border}`,

                color,

                fontSize: 12,

                fontWeight: 600,

                ...style,
            }}
        >
            {children}
        </span>
    );
}