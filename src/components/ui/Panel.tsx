import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    colors,
    radius,
    shadow,
    spacing,
    typography,
} from "../../themes";

interface Props {
    children: ReactNode;

    title?: ReactNode;

    style?: CSSProperties;
}

export function Panel({
    children,
    title,
    style,
}: Props) {
    return (
        <div
            style={{
                background:
                    colors.panel,

                border:
                    `1px solid ${colors.border}`,

                borderRadius:
                    radius.lg,

                boxShadow:
                    shadow.panel,

                overflow: "hidden",

                ...style,
            }}
        >
            {title && (
                <div
                    style={{
                        padding:
                            `${spacing.sm + 2}px ${spacing.md}px`,

                        borderBottom:
                            `1px solid ${colors.border}`,

                        color:
                            colors.text,

                        fontSize:
                            typography.caption
                                .fontSize,

                        fontWeight:
                            typography.caption
                                .fontWeight,

                        lineHeight: 1.4,
                    }}
                >
                    {title}
                </div>
            )}

            {children}
        </div>
    );
}