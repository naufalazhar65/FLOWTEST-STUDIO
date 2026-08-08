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

    style?: CSSProperties;
}

export function Panel({
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

                boxShadow:
                    shadow.panel,

                overflow: "hidden",

                ...style,
            }}
        >
            {children}
        </div>
    );
}