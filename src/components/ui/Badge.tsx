import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    animation,
    colors,
    radius,
    spacing,
    typography,
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

                gap: spacing.xs + 2,

                minHeight: 24,

                boxSizing:
                    "border-box",

                padding:
                    `${spacing.xs}px ${spacing.sm + 2}px`,

                borderRadius:
                    radius.full,

                background:
                    colors.panelHover,

                border:
                    `1px solid ${colors.border}`,

                color,

                fontSize:
                    typography.caption
                        .fontSize,

                fontWeight:
                    typography.caption
                        .fontWeight,

                lineHeight: 1,

                whiteSpace: "nowrap",

                userSelect: "none",

                transition:
                    `border-color ${animation.fast}, background ${animation.fast}`,

                ...style,
            }}
        >
            {children}
        </span>
    );
}