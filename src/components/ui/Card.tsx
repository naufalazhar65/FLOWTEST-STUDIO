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

    padding?: number;

    hoverable?: boolean;

    style?: CSSProperties;
}

export function Card({
    children,
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
                    radius.md,

                boxShadow:
                    shadow.card,

                ...style,
            }}
        >
            {children}
        </div>
    );
}