import type {
    ReactNode,
} from "react";

import {
    colors,
    spacing,
    typography,
} from "../../themes";

interface Props {
    children: ReactNode;
}

export function Label({
    children,
}: Props) {
    return (
        <div
            style={{
                marginBottom:
                    spacing.xs + 2,

                color:
                    colors.textSecondary,

                fontSize:
                    typography.caption
                        .fontSize,

                fontWeight:
                    typography.subtitle
                        .fontWeight,

                lineHeight: 1.4,

                userSelect: "none",
            }}
        >
            {children}
        </div>
    );
}