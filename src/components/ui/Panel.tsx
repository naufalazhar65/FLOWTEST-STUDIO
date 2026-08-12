import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    colors,
    radius,
    shadow,
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
                        padding: "10px 14px",

                        borderBottom:
                            `1px solid ${colors.border}`,

                        color:
                            colors.text,

                        fontSize: 12,

                        fontWeight: 600,
                    }}
                >
                    {title}
                </div>
            )}

            {children}
        </div>
    );
}