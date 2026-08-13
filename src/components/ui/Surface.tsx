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

    style?: CSSProperties;
}

export function Surface({
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
                    radius.lg,

                overflow: "hidden",

                ...style,
            }}
        >
            {children}
        </div>
    );
}